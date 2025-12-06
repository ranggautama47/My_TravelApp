<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use App\Models\Transaction;
use App\Models\Locations;
use App\Models\Ticket;
use App\Models\TicketCategory;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use Xendit\Configuration;
use Carbon\Carbon;
use App\Models\Reviews;

class PaymentController extends Controller
{
    protected $apiInstance;

    public function __construct()
    {
        // Konfigurasi Xendit
        Configuration::setXenditKey(config('services.xendit.secret_key'));
        $this->apiInstance = new InvoiceApi();
    }

    public function handlePayment(Request $request)
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('message', 'You must be logged in to proceed');
        }

        $action = $request->input('action');
        $locationId = $request->input('location_id');

        if ($action == 'pay') {
            return $this->processPayment($request);
        }

        if ($action == 'continue') {
            $transaction = Transaction::whereRaw('LOWER(status) = ?', ['pending'])
                ->where('location_id', $locationId)
                ->first();

            if (!$transaction || empty($transaction->checkout_link)) {
                return Inertia::back()->with('message', 'Invalid or expired transaction.');
            }

            return Inertia::location($transaction->checkout_link);
        }

        abort(400, 'Invalid action.');
    }

    public function processPayment(Request $request)
    {
        $uuid = (string) Str::uuid();

        $locationId = $request->input('location_id');
        $ticketId = $request->input('ticket_id'); // Diperbaiki: $tickedId -> $ticketId
        $ticketAmount = $request->input('ticket_quantity');
        $ticketPrice = $request->input('ticket_price');
        $ticketTax = $request->input('tax');
        $totalPrice = $request->input('total_price');

        $user = auth()->user();

        if (
            !$locationId || !$ticketId ||
            !$ticketAmount || !$ticketPrice || !$ticketTax || !$totalPrice
        ) {
            return redirect()->back()->with('message', 'Please fill in all required fields.');
        }

        $location = Locations::find($locationId);
        $ticket = Ticket::find($ticketId);

        if (!$location || !$ticket) {
            return redirect()->back()->with('message', 'Invalid ticket or location.'); // Diperbaiki: massage -> message
        }

        $ticketCategory = TicketCategory::find($ticket->ticket_category_id);
        $ticketCategoryName = $ticketCategory->name ?? 'Umum';

        $transactionCode = 'TRX_' . mt_rand(100000, 999999);
        $description = "Pembayaran tiket untuk " . $location->name; // Ditambahkan: definisi $description

        try {
            $rawToken = Str::random(64); // Diperbaiki: tambah titik koma
            $hashedToken = hash('sha256', $rawToken);

            $createInvoiceRequest = new CreateInvoiceRequest([
                'external_id' => $uuid,
                'amount' => (float) $totalPrice,
                'description' => $description,
                'invoice_duration' => 3600,
                'currency' => 'IDR',
                'customer' => [
                    'given_names' => $user->name ?? 'User',
                    'mobile_number' => $user->phone ?? '+6200000000000',
                ],
                'success_redirect_url' => route('payment.success'),
                'failure_redirect_url' => route('payment.failed'),
                'locale' => 'id',
                'items' => [[
                    'name' => "Tiket Masuk - " . $location->name,
                    'quantity' => (int) $ticketAmount,
                    'price' => (float) $ticketPrice, // ✅ tambahkan ini
                    'category' => $ticketCategoryName,
                    'url' => route('location.detail', ['id' => $locationId]),
                ]],
                'fees' => [[
                    'type' => 'PPN 10%',
                    'value' => $ticketTax,
                ]],
                "customer_notification_preference" => [
                    "invoice_paid" => ["whatsapp"],
                ],
            ]);

            $invoice = $this->apiInstance->createInvoice($createInvoiceRequest);

            Transaction::create([
                'code' => $transactionCode,
                'external_id' => $uuid,
                'validation_token' => $hashedToken,
                'checkout_link' => $invoice['invoice_url'],
                // set initial payment_method if available from invoice, otherwise null
                'payment_method' => $invoice['payment_method'] ?? null,
                // normalize status to uppercase string
                'payment_status' => strtoupper($invoice['status'] ?? ($invoice->getStatus() ?? 'PENDING')),
                'user_id' => $user->id,
                'ticket_id' => $ticketId,
                'location_id' => $locationId,
                'price_per_pack' => $ticketPrice,
                'ppn' => $ticketTax,
                'total' => $totalPrice,
                'qty' => $ticketAmount,
            ]);

            return Inertia::location($invoice['invoice_url']);
        } catch (\Exception $e) {
            Log::error('Failed to create invoice', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            dd($e->getMessage());
            return redirect()->back()->with('message', 'Failed to create invoice. Please try again.'); // Diperbaiki: invoce -> invoice
        }
    }

    public function paymentStatus(Request $request)
    {
        $externalId = $request->input('external_id');
        $token = $request->input('token');

        try {
            $transaction = Transaction::where('external_id', $externalId)->firstOrFail();

            if (!$this->validateToken($transaction, $token)) {
                abort(403, 'Invalid token'); // Diperbaiki: Inavalid -> Invalid
            }

            $result = $this->apiInstance->getInvoices(null, $externalId);
            $invoice = $result[0]; // Diperbaiki: invoce -> invoice

            // Hanya update jika status bukan SETTLED atau PAID (belum final)
            if ($transaction->payment_status != 'SETTLED' && $transaction->payment_status !== 'PAID') {
                $transaction->payment_status = strtoupper($invoice['status'] ?? 'PENDING');
                $transaction->payment_method = $invoice['payment_method'] ?? null;

                // Parse paid_at jika ada
                if (!empty($invoice['paid_at'])) {
                    try {
                        $transaction->paid_at = Carbon::parse($invoice['paid_at'])->toDateTimeString();
                    } catch (\Exception $e) {
                        Log::warning('Failed to parse paid_at from invoice', ['paid_at' => $invoice['paid_at']]);
                    }
                }

                $transaction->save();
                Log::info('Payment status updated', ['external_id' => $externalId, 'new_status' => $transaction->payment_status]);
            }

            $this->clearToken($transaction);

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran berhasil diproses.',
                'payment_status' => $transaction->payment_status,
            ]);
        } catch (\Exception $e) {
            // Tambahkan error handling yang sesuai
            Log::error('Payment status error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses pembayaran.',
            ], 500);
        }
    }

    /**
     * Endpoint baru: Cek status pembayaran terbaru tanpa harus reload halaman
     * Frontend bisa call ini untuk polling status real-time
     */
    public function getPaymentStatus($externalId)
    {
        try {
            $transaction = Transaction::where('external_id', $externalId)
                ->with(['user', 'ticket'])
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'transaction' => [
                    'id' => $transaction->id,
                    'external_id' => $transaction->external_id,
                    'code' => $transaction->code,
                    'payment_status' => $transaction->payment_status,
                    'payment_method' => $transaction->payment_method,
                    'user' => $transaction->user,
                    'ticket' => $transaction->ticket,
                    'price_per_pack' => $transaction->price_per_pack,
                    'ppn' => $transaction->ppn,
                    'total' => $transaction->total,
                    'qty' => $transaction->qty,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Get payment status error', [
                'external_id' => $externalId,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Transaction not found.',
            ], 404);
        }
    }

    // laravel <-> xendit (PAID, PENDING, SETTLED)
    public function handleWebhook(Request $request) // Diperbaiki: fuction -> function
    {
        if ($request->header('x-callback-token') !== config('services.xendit.webhook_secret')) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        try {
            $data = $request->all();

            $transaction = Transaction::where('external_id', $data['external_id'])->firstOrFail();

            // Normalize and set status/method
            $status = strtoupper($data['status'] ?? ($data['status'] ?? 'PENDING'));
            $transaction->payment_status = $status;
            $transaction->payment_method = $data['payment_method'] ?? null;

            // Parse ISO8601 timestamps (e.g. 2025-11-11T16:55:35.928Z) into MySQL DATETIME
            if (!empty($data['paid_at'])) {
                try {
                    $transaction->paid_at = Carbon::parse($data['paid_at'])->toDateTimeString();
                } catch (\Exception $e) {
                    Log::warning('Failed to parse paid_at from webhook', ['paid_at' => $data['paid_at'], 'error' => $e->getMessage()]);
                }
            }

            if (!empty($data['updated'])) {
                try {
                    $transaction->updated_at = Carbon::parse($data['updated'])->toDateTimeString();
                } catch (\Exception $e) {
                    Log::warning('Failed to parse updated from webhook', ['updated' => $data['updated'], 'error' => $e->getMessage()]);
                }
            }

            $transaction->save();

            $this->clearToken($transaction);

            // Create a placeholder review only when payment is confirmed
           if (in_array($status, ['PAID', 'SETTLED'])) {
                Reviews::firstOrCreate(
                    ['transaction_id' => $transaction->id],
                    [
                        'user_id' => $transaction->user_id,
                        'location_id' => $transaction->location_id,
                        'review' => null,
                        'rate_kebersihan' => 0,
                        'rate_keakuratan' => 0,
                        'rate_checkin' => 0,
                        'rate_komunikasi' => 0,
                        'rate_lokasi' => 0,
                        'rate_nilaiekonomis' => 0,
                    ]
                );
            }


            return response()->json([
                'code' => 200,
                'message' => 'Webhook received.',
            ]);
        } catch (\Exception $e) {
            Log::error('Webhook error', [
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Internal error.'], 500);
        }
    }

    protected function validateToken(Transaction $transaction, $token)
    {
        return hash_equals($transaction->validation_token ?? '', hash('sha256', $token));
    }

    protected function clearToken(Transaction $transaction)
    {
        $transaction->validation_token = null;
        $transaction->save();
    }
}

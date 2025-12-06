import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import Table from "@/Components/Tabel";
import Button from "@/Components/Button";
import Pagination from "@/Components/Pagination";
import { Head, usePage } from "@inertiajs/react";
import Search from "@/Components/Search";
import hasAnyPermission from "@/Utils/permissions";
import Badge from "@/Components/Badge";
import { useEffect } from "react";
import { router } from "@inertiajs/react";

export default function Index({ auth }) {
    const { transactions: initialTransactions, filters, can } = usePage().props;
    const [transactions, setTransactions] = useState(initialTransactions);
    const [isPolling, setIsPolling] = useState(true);

    // Endpoint untuk cek status payment real-time
    const fetchPaymentStatusUpdates = async () => {
        try {
            // Extract external IDs dari transaksi yang masih PENDING
            const pendingExternalIds = transactions.data
                .filter((t) => t.payment_status === "PENDING")
                .map((t) => t.external_id);

            if (pendingExternalIds.length === 0) {
                return; // Tidak ada yang PENDING, skip
            }

            // Fetch status untuk setiap transaksi PENDING
            const updates = await Promise.all(
                pendingExternalIds.map((externalId) =>
                    fetch(`/dashboard/payment/check/${externalId}`)
                        .then((res) => res.json())
                        .catch((err) => {
                            console.error(
                                "Error fetching payment status:",
                                err,
                            );
                            return { success: false };
                        }),
                ),
            );

            // Update state dengan data terbaru dari server
            const updatedTransactions = transactions.data.map((transaction) => {
                const update = updates.find(
                    (u) =>
                        u.success &&
                        u.transaction?.external_id === transaction.external_id,
                );
                if (update && update.transaction) {
                    return { ...transaction, ...update.transaction };
                }
                return transaction;
            });

            setTransactions({
                ...transactions,
                data: updatedTransactions,
            });

            // Jika semua sudah tidak PENDING, stop polling
            const anyPending = updatedTransactions.some(
                (t) => t.payment_status === "PENDING",
            );
            if (!anyPending) {
                setIsPolling(false);
            }
        } catch (error) {
            console.error("Failed to fetch payment updates:", error);
        }
    };

    useEffect(() => {
        if (!isPolling) return;

        const interval = setInterval(fetchPaymentStatusUpdates, 3000); // Check setiap 3 detik (lebih cepat)

        return () => clearInterval(interval);
    }, [transactions, isPolling]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Transactions
                </h2>
            }
        >
            <Head title="Transactions" />
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="w-full">
                        <Search
                            url={route("transactions.index")}
                            placeholder={"Search Transactions data by name..."}
                            filters={filters}
                        />
                    </div>
                </div>

                <Table.Card title="Transactions">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Code</Table.Th>
                                <Table.Th>External ID</Table.Th>
                                <Table.Th>Checkout Link</Table.Th>
                                <Table.Th>Payment Method</Table.Th>
                                <Table.Th>Payment Status</Table.Th>
                                <Table.Th>User</Table.Th>
                                <Table.Th>Ticket Code</Table.Th>
                                <Table.Th>Price</Table.Th>
                                <Table.Th>Quantity</Table.Th>
                                <Table.Th>PPN</Table.Th>
                                <Table.Th>Total</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </tr>
                        </Table.Thead>

                        <Table.Tbody
                            key={
                                transactions.current_page +
                                transactions.data.length
                            }
                        >
                            {transactions.data.length > 0 ? (
                                transactions.data.map((transaction, i) => (
                                    <tr key={transaction.id}>
                                        <Table.Td>
                                            {i +
                                                1 +
                                                (transactions.current_page -
                                                    1) *
                                                    transactions.per_page}
                                        </Table.Td>
                                        <Table.Td>{transaction.code}</Table.Td>
                                        <Table.Td>
                                            {transaction.external_id}
                                        </Table.Td>
                                        <Table.Td>
                                            <a
                                                href={transaction.checkout_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                Link
                                            </a>
                                        </Table.Td>
                                        <Table.Td>
                                            {transaction.payment_method}
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                status={
                                                    transaction.payment_status
                                                }
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="font-semibold">
                                                {transaction.user?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {transaction.user?.email}
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            {transaction.ticket?.ticket_code}
                                        </Table.Td>
                                        <Table.Td>
                                            Rp{" "}
                                            {Number(
                                                transaction.price_per_pack,
                                            ).toLocaleString()}
                                        </Table.Td>
                                        <Table.Td>{transaction.qty}</Table.Td>
                                        <Table.Td>
                                            Rp{" "}
                                            {Number(
                                                transaction.ppn,
                                            ).toLocaleString()}
                                        </Table.Td>
                                        <Table.Td>
                                            Rp{" "}
                                            {Number(
                                                transaction.total,
                                            ).toLocaleString()}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-2">
                                                {hasAnyPermission(auth.user, [
                                                    "transactions edit",
                                                ]) && (
                                                    <Button
                                                        type="edit"
                                                        url={route(
                                                            "transactions.edit",
                                                            transaction.id,
                                                        )}
                                                    />
                                                )}
                                                {hasAnyPermission(auth.user, [
                                                    "transactions delete",
                                                ]) && (
                                                    <Button
                                                        type="delete"
                                                        url={route(
                                                            "transactions.destroy",
                                                            transaction.id,
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <Table.Td
                                        colSpan="13"
                                        className="text-center"
                                    >
                                        No transactions found.
                                    </Table.Td>
                                </tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Table.Card>

                <div className="flex items-center justify-center mt-6">
                    {transactions.last_page > 1 && (
                        <Pagination links={transactions.links} />
                    )}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}

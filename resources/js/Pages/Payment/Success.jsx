export default function Success() {
    return (
        <div className="flex flex-col items-center justify-center font-poppins h-screen">
                <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
                <p  className="text-lg">Thank you for your purchase.</p>
                <a
                    href="/"
                    className="px-4 py-2 rounded-full bg-primary-opaque text-white font-semibold mt-4"
                >
                     Back To Home
                </a>
        </div>
    );
}

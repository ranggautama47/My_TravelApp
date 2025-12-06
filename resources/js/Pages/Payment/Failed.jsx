export default function Failed() {
    return (
        <div className="flex flex-col items-center justify-center font-poppins h-screen">
                <h1 className="text-4xl font-bold mb-4">Payment Failed!</h1>
                <p  className="text-lg">Please try again later.</p>
                <a
                    href="/"
                    className="px-4 py-2 rounded-full bg-primary-opaque text-white font-semibold mt-4"
                >
                     Back To Home
                </a>
        </div>
    );
}

export default function GalleryDialog({
    isOpen,
    setIsOpen,
    destination,
    pictures = [],
}) {
    const handleBackdropClick = (event) => {
        if (!event) return;

        const dialog = event.target;
        if (dialog.tagName === "DIALOG") {
            setIsOpen(false);
        }
    };

    // Fungsi untuk menentukan tata letak bergantian
    const gridStyle = (index) => {
        const groupIndex = Math.floor(index / 3);
        const posInGroup = index % 3;

        // Pola bergantian:
        // Grup genap: besar di kiri (index 0), kecil di kanan (index 1, 2)
        // Grup ganjil: kecil di kiri (index 0, 1), besar di kanan (index 2)
        let gridStyle = "";
        if (groupIndex % 2 === 0) {
            // Pola: BESAR - kecil - kecil
            if (posInGroup === 0) {
                return "col-span-2 row-span-2"; // Gambar besar
            } else {
                return "col-span-1 row-span-1"; // Gambar kecil
            }
        } else {
            // Pola: kecil - kecil - BESAR
            if (posInGroup === 1) {
                return "col-span-2 row-span-2"; // Gambar besar
            } else {
                return "col-span-1 row-span-1"; // Gambar kecil
            }
        }
    };

    return (
        <dialog
            open={isOpen}
            onClick={handleBackdropClick}
            className={`group fixed left-0 top-0 !z-[999] m-0 grid h-screen w-screen place-content-center p-0 ${
                isOpen ? "block" : "hidden"
            }`}
        >
            <div className="flex items-center justify-center rounded-xl bg-white p-6 w-full md:w-[600px] lg:w-[900px]">
                <div className="w-full">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl text-primary-opaque font-semibold">
                                {destination}
                            </p>
                            <p className="text-gray-500 mt-2">
                                Semua Foto{" "}
                                <span className="font-bold text-gray-600">
                                    ({pictures.length})
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:cursor-pointer"
                        >
                            <i className="bi bi-x-lg text-2xl text-gray-500 hover:text-gray-700"></i>
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto mt-8">
                        <div className="grid grid-cols-3 gap-2 auto-rows-[150px]">
                            {pictures.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    alt={`${destination} photo ${idx + 1}`}
                                    className={`rounded-lg object-cover w-full h-full ${gridStyle(idx)}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

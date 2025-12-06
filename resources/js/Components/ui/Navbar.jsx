import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Menu, X } from "lucide-react";

export default function Navbar({ auth }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 px-4 bg-transparent">
            <nav className="container mx-auto flex items-center justify-between bg-white shadow-md px-6 py-3 md:px-8 font-poppins rounded-full mt-4">
                {/* Logo */}
                <Link href={route("home")} className="flex items-center select-none">
                    <img
                        src="/assets/logofix.png"
                        alt="Logo"
                        className="h-10 w-auto pointer-events-none"
                    />
                </Link>

                {/* Hamburger Menu (Mobile) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-600 focus:outline-none"
                >
                    {isOpen ? (
                        <X className="w-7 h-7" />
                    ) : (
                        <Menu className="w-7 h-7" />
                    )}
                </button>

                {/* Nav Links (Desktop) */}
                <ul className="hidden md:flex gap-10 items-center text-gray-600 text-base font-medium">
                    <li>
                        <Link
                            href={route("home")}
                            className={`${
                                route().current("home")
                                    ? "text-primary-opaque border-b-2 border-primary-opaque pb-1"
                                    : "hover:text-primary-opaque transition"
                            }`}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("location.index")}
                            className={`${
                                route().current("location.index")
                                    ? "text-primary-opaque border-b-2 border-primary-opaque pb-1"
                                    : "hover:text-primary-opaque transition"
                            }`}
                        >
                            Location
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("location.maps")}
                            className={`${
                                route().current("location.maps")
                                    ? "text-primary-opaque border-b-2 border-primary-opaque pb-1"
                                    : "hover:text-primary-opaque transition"
                            }`}
                        >
                            Maps
                        </Link>
                    </li>
                </ul>

                {/* Auth Section */}
                {auth.user ? (
                    <Link
                        href={route("dashboard")}
                        className="hidden md:block rounded-full overflow-hidden border-2 border-primary-opaque hover:scale-105 transition"
                    >
                        <img
                            src={
                                auth.user.profile_picture ||
                                "/assets/profile_placeholder.webp"
                            }
                            alt="User"
                            draggable="false"
                            onDragStart={(e) => e.preventDefault()}
                            className="h-11 w-11 rounded-full"
                        />
                    </Link>
                ) : (
                    <Link
                        href={route("login")}
                        className="hidden md:block px-8 py-2.5 bg-primary-opaque rounded-full text-white font-semibold hover:bg-primary-hover transition-all"
                    >
                        Login
                    </Link>
                )}

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="absolute top-20 left-0 w-full bg-white rounded-2xl shadow-lg md:hidden px-6 py-4">
                        <ul className="flex flex-col gap-4 text-gray-700 text-lg font-medium">
                            <li>
                                <Link
                                    href={route("home")}
                                    className="block py-2 hover:text-primary-opaque"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("location.index")}
                                    className="block py-2 hover:text-primary-opaque"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Location
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("location.maps")}
                                    className="block py-2 hover:text-primary-opaque"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Maps
                                </Link>
                            </li>

                            <hr className="my-2 border-gray-200" />

                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 py-2 hover:text-primary-opaque"
                                >
                                    <img
                                        src={
                                            auth.user.profile_picture ||
                                            "/assets/profile_placeholder.webp"
                                        }
                                        alt="User"
                                        className="h-10 w-10 rounded-full border"
                                    />
                                    <span className="font-semibold">
                                        Dashboard
                                    </span>
                                </Link>
                            ) : (
                                <Link
                                    href={route("login")}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center py-2 bg-primary-opaque text-white rounded-full hover:bg-primary-hover transition"
                                >
                                    Login
                                </Link>
                            )}
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
}

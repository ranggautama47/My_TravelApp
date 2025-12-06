import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import hasAnyPermission from "@/Utils/permissions";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Ticket,
  MapPin,
  Layers,
  Globe2,
  Star,
  LogOut,
  UserCircle,
  Menu,
  X,
  Tags,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
  const user = usePage().props.auth.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, route: "dashboard", perm: [] },
    { label: "Permissions", icon: <ShieldCheck size={18} />, route: "permissions.index", perm: ["permissions index"] },
    { label: "Roles", icon: <Layers size={18} />, route: "roles.index", perm: ["roles index"] },
    { label: "Users", icon: <Users size={18} />, route: "users.index", perm: ["users index"] },
    { label: "Categories", icon: <Tags size={18} />, route: "categories.index", perm: ["categories index"] },
    { label: "Regions", icon: <Globe2 size={18} />, route: "regions.index", perm: ["regions index"] },
    { label: "Locations", icon: <MapPin size={18} />, route: "locations.index", perm: ["locations index"] },
    { label: "Tickets", icon: <Ticket size={18} />, route: "tickets.index", perm: ["tickets index"] },
    { label: "Ticket Categories", icon: <Layers size={18} />, route: "ticket-categories.index", perm: ["tickets index"] },
    { label: "Transactions", icon: <Star size={18} />, route: "transactions.index", perm: ["transactions index"] },
    { label: "Reviews", icon: <Star size={18} />, route: "reviews.index", perm: ["reviews index"] },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-poppins">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <ApplicationLogo className="h-8 w-auto text-primary-opaque" />
            <span className="font-semibold text-lg text-gray-700">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map(
            (item, i) =>
              (item.perm.length === 0 || hasAnyPermission(user, item.perm)) && (
                <Link
                  key={i}
                  href={route(item.route)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-200
                    ${
                      route().current(item.route)
                        ? "bg-primary-opaque text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
            {/* Left: Menu & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-600 hover:text-gray-800"
              >
                <Menu size={24} />
              </button>
              <div className="text-lg sm:text-xl font-semibold text-gray-800">
                {header || "Dashboard"}
              </div>
            </div>

            {/* Right: User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <img
                  src={
                    user.profile_picture ||
                    "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)
                  }
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full border border-gray-300 object-cover"
                />
                <span className="hidden sm:flex flex-col text-sm leading-tight text-left">
                  <span className="font-semibold text-gray-800">{user.name}</span>
                  <span className="text-gray-500">{user.email}</span>
                </span>
                <UserCircle size={20} className="text-gray-500 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href={route("profile.edit")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-x-auto overflow-y-auto">
        <div className="min-w-full">
            {children}
        </div>
        </main>
      </div>
    </div>

  );

}

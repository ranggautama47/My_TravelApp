import React from 'react';
import { useForm, router } from '@inertiajs/react'; // ✅ tambahkan router di sini
import { IconSearch } from '@tabler/icons-react';

export default function Search({ url, placeholder }) {
    const { data, setData } = useForm({
        search: '',
    });

    const handleSearchData = (e) => {
        e.preventDefault();
        router.get(`${url}?search=${data.search}`); // ✅ gunakan router.get bukan get()
    };

    return (
        <form onSubmit={handleSearchData}>
            <div className="relative">
                <input
                    type="text"
                    value={data.search}
                    onChange={(e) => setData('search', e.target.value)}
                    className="py-2 px-4 pr-11 block w-full rounded-lg text-sm border focus:outline-hidden focus:ring-0 focus:ring-gray-400 text-gray-700 bg-white border-gray-200 focus:border-gray-200"
                    placeholder={placeholder}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-4">
                    <IconSearch size={18} strokeWidth={1.5} />
                </div>
            </div>
        </form>
    );
}

import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import Table from "@/Components/Tabel";
import Button from "@/Components/Button";
import Pagination from "@/Components/Pagination";
import { Head, usePage } from "@inertiajs/react";
import Search from "@/Components/Search";
import hasAnyPermission from "@/Utils/permissions";

export default function Index() {
    // destruct categories props
    const { auth, categories, filters } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Categories
                </h2>
            }
        >
            <Head title={"Categories"} />
            <Container>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {hasAnyPermission(auth.user, ["categories create"]) && (
                        <Button type={"add"} url={route("categories.create")} />
                    )}

                    <div className="w-full md:w-4.6">
                        <Search
                            url={route("categories.index")}
                            placeholder={"Search Categories data by name..."}
                            filter={filters}
                        />
                    </div>
                </div>
                <Table.Card title={"Categories"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Categories Name</Table.Th>
                                <Table.Th>Image</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {categories.data.map((category, i) => (
                                <tr key={category.id}>
                                    <Table.Td>
                                        {++i +
                                            (categories.current_page - 1) *
                                                categories.per_page}{" "}
                                    </Table.Td>
                                    <Table.Td>{category.name}</Table.Td>
                                    <Table.Td>
                                        {category.image ? (
                                            <img
                                                src={`/storage/${category.image}`}
                                                alt={category.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                        ) : (
                                            <span className="text-gray-500">
                                                No Image
                                            </span>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            {hasAnyPermission(auth.user, [
                                                "categories edit",
                                            ]) && (
                                                <Button
                                                    type={"edit"}
                                                    url={route(
                                                        "categories.edit",
                                                        category.id,
                                                    )}
                                                />
                                            )}
                                            {hasAnyPermission(auth.user, [
                                                "categories delete",
                                            ]) && (
                                                <Button
                                                    type={"delete"}
                                                    url={route(
                                                        "categories.destroy",
                                                        category.id,
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>

                <div className="flex item-center justify-center">
                    {categories.last_page !== 1 && (
                        <Pagination links={categories.links} />
                    )}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}

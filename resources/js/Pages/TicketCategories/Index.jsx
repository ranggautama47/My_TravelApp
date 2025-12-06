import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import Table from "@/Components/Tabel";
import Button from "@/Components/Button";
import Pagination from "@/Components/Pagination";
import { Head, usePage } from "@inertiajs/react";
import Search from "@/Components/Search";
import hasAnyPermission from "@/Utils/permissions";

export default function Index({ auth }) {
    //DESTUCTURE TICKET CATEGORY DAN FILTER DARI PROPS
    const { ticketCategories, filters } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Ticket Categories
                </h2>
            }
        >
            <Head title="Ticket Categories" />
            <Container>
                <div className="mb-4 flex items-center justify-between ga-4">
                    {hasAnyPermission(auth.user, ["tickets create"]) && (
                        <Button type={"add"} url={route("ticket-categories.create")} />
                    )}

                    <div className="w-full md:w-4/6">
                        <Search
                            url={route("ticket-categories.index")}
                            placeholder="Search Ticket Categories by name..."
                            filter={filters}
                        />
                    </div>
                </div>
                <Table.Card title="Ticket Categories">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Ticket Category Name</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {ticketCategories.data.map((ticketCategory, i) => (
                                <tr key={i}>
                                    <Table.Td>
                                        {++i +
                                            (ticketCategories.current_page -
                                                1) *
                                                ticketCategories.per_page}
                                    </Table.Td>
                                    <Table.Td>{ticketCategory.name}</Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            {hasAnyPermission(auth.user, ["tickets edit"]) && (
                                                <Button
                                                    type={"edit"}
                                                    url={route("ticket-categories.edit", ticketCategory.id)}
                                                />
                                            )}
                                            {hasAnyPermission(auth.user, ["tickets delete"]) && (
                                                <Button
                                                    type={"delete"}
                                                    url={route("ticket-categories.destroy", ticketCategory.id)}
                                                />
                                            )}
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>
                <div className="flex items-center justify-center">
                    {ticketCategories.last_page !== 1 && (
                        <Pagination links={ticketCategories.links} />
                    )}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}

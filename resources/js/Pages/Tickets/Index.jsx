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
    //destructure tickets dan filters dari props
    const { tickets, filters } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tickets
                </h2>
            }
        >
            <Head title={"Tickets"} />
            <Container>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {hasAnyPermission(auth.user, ["tickets create"]) && (
                        <Button type={"add"} url={route("tickets.create")} />
                    )}

                    <div className="w-full md:w-4/6">
                        <Search
                            url={route("tickets.index")}
                            placeholder={
                                "Search tickets data by ticket code..."
                            }
                            filter={filters}
                        />
                    </div>
                </div>
                <Table.Card title={"Tickets"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Ticket Code</Table.Th>
                                <Table.Th>Ticket Type</Table.Th>
                                <Table.Th>Price</Table.Th>
                                <Table.Th>Quantity</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {tickets.data.map((ticket, i) => (
                                <tr key={ticket.id}>
                                    <Table.Td>
                                        {++i +
                                            (tickets.current_page - 1) *
                                                tickets.per_page}{" "}
                                    </Table.Td>
                                    <Table.Td>{ticket.ticket_code}</Table.Td>
                                    <Table.Td>{ticket.name}</Table.Td>
                                    <Table.Td>
                                        Rp{ticket.price_per_pack.toLocaleString()}
                                    </Table.Td>
                                    <Table.Td>{ticket.qty}</Table.Td>

                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            {hasAnyPermission(auth.user, [
                                                "tickets edit",
                                            ]) && (
                                                <Button
                                                    type={"edit"}
                                                    url={route(
                                                        "tickets.edit",
                                                        ticket.id,
                                                    )}
                                                />
                                            )}
                                            {hasAnyPermission(auth.user, [
                                                "tickets delete",
                                            ]) && (
                                                <Button
                                                    type={"delete"}
                                                    url={route(
                                                        "tickets.destroy",
                                                        ticket.id,
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

                <div className="flex items-center justify-center">
                    {tickets.last_page !== 1 && (
                        <Pagination links={tickets.links} />
                    )}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}

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
    const { auth, roles, filters } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Roles
                </h2>
            }
        >
            <Head title={"Roles"} />
            <Container>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {hasAnyPermission(auth.user, ["roles create"]) && (
                        <Button type={"add"} url={route("roles.create")} />
                    )}
                    <div className="w-full md:w-4/6">
                        <Search
                            url={route("roles.index")}
                            placeholder={"Search roles data by name..."}
                            filters={filters}
                        />
                    </div>
                </div>

                <Table.Card title={"Roles"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Role Name</Table.Th>
                                <Table.Th>Permissions</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {roles.data.map((role, i) => (
                                <tr key={i}>
                                    <Table.Td>
                                        {++i +
                                            (roles.current_page - 1) *
                                                roles.per_page}
                                    </Table.Td>
                                    <Table.Td>{role.name}</Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {role.name == "admin" ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-700">
                                                    all-permissions
                                                </span>
                                            ) : (
                                                role.permissions.map(
                                                    (permission, j) => (
                                                        <span
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-700"
                                                            key={j}
                                                        >
                                                            {permission.name}
                                                        </span>
                                                    ),
                                                )
                                            )}
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            {hasAnyPermission(auth.user, [
                                                "roles edit",
                                            ]) && (
                                                <Button
                                                    type={"edit"}
                                                    url={route(
                                                        "roles.edit",
                                                        role.id,
                                                    )}
                                                />
                                            )}
                                            {hasAnyPermission(auth.user, [
                                                "roles delete",
                                            ]) && (
                                                <Button
                                                    type={"delete"}
                                                    url={route(
                                                        "roles.destroy",
                                                        role.id,
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
                    {roles.last_page !== 1 && (
                        <Pagination links={roles.links} />
                    )}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}

import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import Table from "@/Components/Tabel";
import Button from "@/Components/Button";
import Pagination from "@/Components/Pagination";
import { Head, usePage } from "@inertiajs/react";
import Search from "@/Components/Search";
import hasAnyPermission from "@/Utils/permissions";

// Komponen Rating Bintang dengan ⭐
const RatingStars = ({ rating, max = 5 }) => {
    const filledStars = "⭐".repeat(rating);
    const emptyStars = "☆".repeat(max - rating);

    return (
        <span>
            {filledStars}
            {emptyStars}
            {/* ({rating} out of {max}) */}
        </span>
    );
};

export default function Index({ auth }) {
    const { reviews, filters, can } = usePage().props;

    const isAdmin = auth.user.roles.includes("admin");

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Reviews
                </h2>
            }
        >
            <Head title={"Reviews"} />
            <Container>
                <div className="mb-4 flex items-center justify-between gap-4">
                    {hasAnyPermission(auth.user, ["reviews create"]) && (
                        <Button type={"add"} url={route("reviews.create")} />
                    )}

                    <div className="w-full md:w-4/6">
                        <Search
                            url={route("reviews.index")}
                            placeholder={"Search Reviews data by name..."}
                            filter={filters}
                        />
                    </div>
                </div>
                <Table.Card title={"Reviews"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>User</Table.Th>
                                <Table.Th>Locations</Table.Th>
                                <Table.Th>Transaction</Table.Th>
                                <Table.Th>Kebersihan</Table.Th>
                                <Table.Th>Keakuratan</Table.Th>
                                <Table.Th>Check in</Table.Th>
                                <Table.Th>Komunikasi</Table.Th>
                                <Table.Th>Lokasi</Table.Th>
                                <Table.Th>Nilai Ekonomi</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {reviews.data.map((review, i) => (
                                <tr key={review.id}>
                                    <Table.Td>
                                        {++i + (reviews.current_page - 1) * reviews.per_page}
                                    </Table.Td>
                                    <Table.Td>{review.user?.name}</Table.Td>
                                    <Table.Td>{review.location?.title}</Table.Td>
                                    <Table.Td>{review.transaction?.code}</Table.Td>

                                    <Table.Td>
                                        <RatingStars
                                            rating={review.rate_kebersihan}
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <RatingStars
                                            rating={review.rate_keakuratan}
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <RatingStars
                                            rating={review.rate_checkin}
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <RatingStars
                                            rating={review.rate_komunikasi}
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <RatingStars
                                            rating={review.rate_lokasi}
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <RatingStars
                                            rating={
                                                review.rate_nilaiekonomis}
                                        />
                                    </Table.Td>

                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            {hasAnyPermission(auth.user, [
                                                "reviews edit",
                                            ]) && (
                                                <Button
                                                    type={"edit"}
                                                    url={route(
                                                        "reviews.edit",
                                                        review.id,
                                                    )}
                                                />
                                            )}
                                            {hasAnyPermission(auth.user, [
                                                "reviews delete",
                                            ]) && (
                                                <Button
                                                    type={"delete"}
                                                    url={route(
                                                        "reviews.destroy",
                                                        review.id,
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
                    {reviews.last_page !== 1 && (
                        <Pagination links={reviews.links} />
                    )}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}

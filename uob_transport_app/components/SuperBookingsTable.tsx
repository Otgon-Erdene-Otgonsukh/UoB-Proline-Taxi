import {
    Table, TableBody, TableHead, TableRow, TableContainer, Paper,
    Box,
    TablePagination
} from "@mui/material";
import { StyledTableCell } from "@/components/StyledTableCell";
import CustomizedButton from "@/components/CustomizedButton";
import { BookingRecord } from "@/model/models";
import { userStatusToIntMap, userStatusToStrMap, roleReadableStrMap } from "@/app/super/constants";
import { TablePaginationProps } from "@mui/material";

interface BookingTableViewProps {
    data: BookingRecord[];
    count: number;
    page: number;
    pageSize: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onPageSizeChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    ActionsComponent: TablePaginationProps['ActionsComponent']
    onViewDetails: (booking: BookingRecord) => void;
    onEditBooking: (booking: BookingRecord) => void;
    onCancelBooking: (booking: BookingRecord) => void;
}

export const BookingTable = ({ data, count, page, pageSize, onPageChange, onPageSizeChange, ActionsComponent, onViewDetails, onEditBooking, onCancelBooking }: BookingTableViewProps) => {

    return (
        <Box>
            <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "none" }}
            >
                <Table
                    sx={{ minWidth: 500, borderCollapse: "collapse" }}
                    aria-label="booking table"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Pick-up Time</StyledTableCell>
                            <StyledTableCell>From</StyledTableCell>
                            <StyledTableCell>To</StyledTableCell>
                            <StyledTableCell>Booking Status</StyledTableCell>
                            <StyledTableCell>Operation</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    "&:hover": { bgcolor: "#f9fafb" },
                                    transition: "background-color 0.3s"
                                }}>
                                <StyledTableCell>{row.trip.pickup_time}</StyledTableCell>
                                <StyledTableCell>{row.trip.pickup_location}</StyledTableCell>
                                <StyledTableCell>{row.trip.dropoff_location}</StyledTableCell>
                                <StyledTableCell>
                                    <span
                                        className={`inline-block px-5 py-1 rounded-full text-xs font-medium ${row.booking_status === "Approved"
                                            ? "bg-green-100 text-green-800 border border-green-800"
                                            : row.booking_status === "Rejected"
                                                ? "bg-red-100 text-red-800 border border-red-800"
                                                : row.booking_status === "Cancelled"
                                                    ? "bg-gray-300 text-gray-900 border border-gray-900"
                                                    : "bg-yellow-100 text-yellow-800 border border-yellow-800"
                                            }`}
                                    >
                                        {row.booking_status}
                                    </span>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <div className="flex gap-2 justify-center">
                                        <CustomizedButton
                                            click={() => onViewDetails(row)}
                                            type="warning"
                                            title="View"
                                        />
                                        {row.booking_status === "Pending" && (
                                            <CustomizedButton
                                                click={() => onEditBooking(row)}
                                                type="warning"
                                                title="Edit"
                                            />
                                        )}
                                        {row.booking_status === "Pending" && (
                                            <CustomizedButton
                                                click={() => onCancelBooking(row)}
                                                type="error"
                                                title="Cancel"
                                            />
                                        )}
                                    </div>
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <TablePagination
                    component="div"
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    count={count}
                    rowsPerPage={pageSize}
                    page={page}
                    slotProps={{
                        select: {
                            inputProps: {
                                "aria-label": "rows per page",
                            },
                            native: true,
                        },
                    }}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onPageSizeChange}
                    ActionsComponent={ActionsComponent}
                />
            </Box>
        </Box>
    );
};
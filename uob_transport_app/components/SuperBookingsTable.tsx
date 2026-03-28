"use client";

import {
    Table, TableBody, TableHead, TableRow, TableContainer, Paper,
    Box,
    TablePagination,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    TextField,
    Typography,
    InputAdornment,
    Button
} from "@mui/material";
import { StyledTableCell } from "@/components/StyledTableCell";
import CustomizedButton from "@/components/CustomizedButton";
import { BookingRecord } from "@/model/models";
import { TablePaginationProps } from "@mui/material";
import { useState } from "react";
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';

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
    onPriceAttached: () => void;
    openSnackBar: () => void;
}

export const BookingTable = ({ data, count, page, pageSize, onPageChange, onPageSizeChange, ActionsComponent, onViewDetails, onEditBooking, onCancelBooking, onPriceAttached, openSnackBar }: BookingTableViewProps) => {

    const [priceOpen, setPriceOpen] = useState(false);
    const [price, setPrice] = useState("");
    const [activeBookingId, setActiveBookingId] = useState<number | null>(null);
    const [notValidPrice, setNotValidPrice] = useState(false);
    const [empty, setEmpty] = useState(false);

    const handlePriceAttach = async () => {
        let fail = false;
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            fail = true;
            setNotValidPrice(true);
        }
        if (price.length === 0) {
            setEmpty(true);
            fail = true;
        }

        if (!fail) {
            const body = {
                price: price,
                booking_id: activeBookingId
            };

            try {
                const res = await fetch("/api/price-attach", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });

                if (res.status === 201) {
                    onPriceAttached();
                    openSnackBar();
                }
            } catch {
                // Keep the dialog open on request failure so user can retry.
            }
        }
    }

    return (
        <Box>
            <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "none" }}
            >
                <Table
                    sx={{ minWidth: 500, borderCollapse: "collapse" }}
                    aria-label="booking table"
                    size="small"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Pick-up Time</StyledTableCell>
                            <StyledTableCell>From</StyledTableCell>
                            <StyledTableCell>To</StyledTableCell>
                            <StyledTableCell>Booking Status</StyledTableCell>
                            <StyledTableCell>Price</StyledTableCell>
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
                                <StyledTableCell>{row.User.full_name}</StyledTableCell>
                                <StyledTableCell>
                          {row.trip.pickup_time
                            ? new Date(row.trip.pickup_time).toLocaleString()
                            : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.trip.pickup_location.includes("{") // Temporary check to see if this is an old style booking.
                            ? // If it's a new booking style, use both the short name and the city name (last part of address - 5)
                            JSON.parse(
                              row.trip.pickup_location,
                            ).short_name.includes("Airport")
                              ? JSON.parse(row.trip.pickup_location).short_name
                              : JSON.parse(row.trip.pickup_location)
                                .short_name +
                              ", " +
                              JSON.parse(row.trip.pickup_location)
                                .address.split(",")
                                .slice(-5)[0]
                                .trim()
                            : row.trip.pickup_location}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.trip.dropoff_location.includes("{") // Temporary check to see if this is an old style booking.
                            ? JSON.parse(
                              row.trip.dropoff_location,
                            ).short_name.includes("Airport")
                              ? JSON.parse(row.trip.dropoff_location).short_name
                              : JSON.parse(row.trip.dropoff_location)
                                .short_name +
                              ", " +
                              JSON.parse(row.trip.dropoff_location)
                                .address.split(",")
                                .slice(-5)[0]
                                .trim()
                            : row.trip.dropoff_location}
                        </StyledTableCell>
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
                                    <span className="text-green-600 font-bold text-[15px]">{row.trip.price ? `£ ${row.trip.price}` : row.booking_status !== "Cancelled" ? <CustomizedButton click={() => {setPriceOpen(true); setActiveBookingId(row.booking_id)}} type="warning" title="Add"></CustomizedButton> : "N/A"}</span>
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
            <Dialog open={priceOpen} onClose={() => {setPriceOpen(false); setActiveBookingId(null); setNotValidPrice(false); setEmpty(false)}}>
                <DialogTitle sx={{ bgcolor: "#2c2c2c", textAlign: "center", fontFamily: "aleo", color: "white", fontSize: 27}}>Attach a price</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 360}}>
                    <Typography sx={{ mt: 2, color: "#2c2c2c"}}>Enter a price below to be attached to the booking:</Typography>
                    <TextField label="Price" variant="standard" onChange={(e) => {setPrice(e.target.value); setEmpty(false); setNotValidPrice(false)}} fullWidth slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <CurrencyPoundIcon/>
                                </InputAdornment>
                            )
                        }
                    }}
                    error={empty || notValidPrice}
                    helperText={empty ? "Please enter a price" : notValidPrice ? "Negative price and letters not allowed" : ""}
                    ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{
                            color: "#2c2c2c",
                            transition: "all 300ms",
                            ":hover": { bgcolor: "#2c2c2c", color: "white" },
                        }}
                        onClick={() => {setPriceOpen(false); setActiveBookingId(null); setNotValidPrice(false); setEmpty(false)}}
                        >
                        Close
                    </Button>
                    <Button
                        type="button"
                        form="priceForm"
                        sx={{
                            mr: 2,
                            color: "#2c2c2c",
                            transition: "all 300ms",
                            ":hover": { bgcolor: "#2c2c2c", color: "white" },
                        }}
                        onClick={handlePriceAttach}
                        >
                        Attach
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
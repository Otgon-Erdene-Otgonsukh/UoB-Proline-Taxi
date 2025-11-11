"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TableHead } from "@mui/material";
import Box from "@mui/material/Box";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { BookingRecord } from "@/src/model/models";
import { getUserBookingList } from "./requests";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const page = () => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("login");
    }
    getUserBookingList(paginationMeta.page, paginationMeta.pageSize).then(
      (res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
            setBookingListData(data.bookings);
          });
        }
      }
    );
  }, []);

  const handleClick = () => {
    router.push("/book");
  };

  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPaginationMeta({
      ...paginationMeta,
      page: newPage,
    });
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaginationMeta({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
  };

  const [bookingListData, setBookingListData] = useState<BookingRecord[]>([]);

  return (
    <div className="flex min-h-screen justify-center items-center font-inter p-4">
      <div className="bg-white shadow-lg/20 rounded-lg p-6 md:p-8 w-full max-w-6xl my-15 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-aleo text-2xl sm:text-3xl font-semibold text-shadow-lg/20">
            MY BOOKINGS
          </h1>
          <button
            onClick={handleClick}
            className="bg-[#2c2c2c] text-white py-2 px-6 rounded-md hover:bg-[#474747] hover:scale-101 transition-all duration-200 text-sm font-light"
          >
            + New Booking
          </button>
        </div>

        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", border: "none" }}
        >
          <Table
            sx={{ minWidth: 500, borderCollapse: "collapse" }}
            aria-label="custom pagination table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell
                  sx={{
                    border: "2px solid #111827",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "0.95rem",

                    color: "#111827",
                  }}
                >
                  Time Created
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    border: "2px solid #111827",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "0.95rem",

                    color: "#111827",
                  }}
                >
                  From
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    border: "2px solid #111827",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "0.95rem",

                    color: "#111827",
                  }}
                >
                  To
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    border: "2px solid #111827",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "0.95rem",

                    color: "#111827",
                  }}
                >
                  Booking Status
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    border: "2px solid #111827",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "0.95rem",

                    color: "#111827",
                  }}
                >
                  Operation
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingListData &&
                bookingListData.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { bgcolor: "#f9fafb" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell
                      sx={{
                        border: "2px solid #111827",
                        textAlign: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      {row.time_created
                        ? new Date(row.time_created).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid #111827",
                        textAlign: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      {row.trip.pickup_location}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid #111827",
                        textAlign: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      {row.trip.dropoff_location}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid #111827",
                        textAlign: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span
                        className={`inline-block px-5 py-1 rounded-full text-xs font-medium ${
                          row.booking_status === "Approved"
                            ? "bg-green-100 text-green-800 border border-green-800"
                            : row.booking_status === "Rejected"
                            ? "bg-red-100 text-red-800 border border-red-800"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-800"
                        }`}
                      >
                        {row.booking_status}
                      </span>
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid #111827",
                        textAlign: "center",
                        fontSize: "0.875rem",
                      }}
                    >
                      <div className="flex gap-2 justify-center">
                        <button className="bg-[#2c2c2c] text-white py-1.5 px-4 rounded-md hover:bg-[#414040] hover:scale-101 transition-all duration-200 text-sm font-light">
                          View
                        </button>
                        <button className="bg-white border-2 border-[#2c2c2c] text-[#2c2c2c] py-1.5 px-4 rounded-md hover:bg-gray-50 hover:scale-101 transition-all duration-200 text-sm font-light">
                          Cancel
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex justify-center mt-4">
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            count={bookingListData.length}
            rowsPerPage={paginationMeta.pageSize}
            page={paginationMeta.page}
            slotProps={{
              select: {
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              },
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangePageSize}
            ActionsComponent={TablePaginationActions}
          />
        </div>
      </div>
    </div>
  );
};

export default page;

'use client';

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, TableHead } from "@mui/material";
import Box from '@mui/material/Box';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { BookingRecord } from "@/src/model/models";
import { getUserBookingList } from "./requests";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const page = () => {

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push("login")
    }
    getUserBookingList(paginationMeta.page, paginationMeta.pageSize).then(res => {
      if (res.status === 200) {
        res.json().then(data => {
          console.log(data);
          setBookingListData(data.bookings)
        })
      }
    })
  }, [])

  const handleClick = () => {
    router.push("/book")
  }

  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10
  })

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPaginationMeta({
      ...paginationMeta,
      page: newPage
    });
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPaginationMeta({
      page: 0,
      pageSize: parseInt(event.target.value, 10)
    })
  };

  const [bookingListData, setBookingListData] = useState<BookingRecord[]>([])

  return (
    <div className="mt-5">
      <div className="justify-self-end mb-2">
        <Button variant="contained" onClick={handleClick}>
          + New Booking
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Time Created</StyledTableCell>
              <StyledTableCell align="left">From</StyledTableCell>
              <StyledTableCell align="left">To</StyledTableCell>
              <StyledTableCell align="left">Booking Status</StyledTableCell>
              <StyledTableCell align="left">Operation</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookingListData && bookingListData.map((row) => (
              <TableRow key={row.time_created}>
                <TableCell style={{ width: 160 }}>
                  {row.time_created}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.trip.pickup_location}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.trip.dropoff_location}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  {row.booking_status}
                </TableCell>
                <TableCell style={{ width: 160 }}>
                  <Button color="primary">View</Button>
                  <Button color="error">Cancel</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={bookingListData.length}
                rowsPerPage={paginationMeta.pageSize}
                page={paginationMeta.page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangePageSize}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  )
}

export default page
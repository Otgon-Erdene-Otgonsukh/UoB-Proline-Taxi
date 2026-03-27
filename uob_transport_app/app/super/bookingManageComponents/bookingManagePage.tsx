"use client";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography, useTheme } from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  Cancel as CancelIcon,
  Close as CloseIcon,
  FindInPage as FindInPageIcon,
} from '@mui/icons-material';
import React, { useState, useEffect, useRef } from "react";
import { BookingRecord } from "@/model/models";
import { BookingTable } from "@/components/SuperBookingsTable";
import { DateTimePicker } from "@/components/datetimePicker/DateTimePicker";
import { enLocale } from "@/components/datetimePicker/locale";
import { bookingStatus } from "@/app/home/constants";
import ConfirmDialog from "@/components/confirmDIalog";
import CustomizedButton from "@/components/CustomizedButton";
import BookingPage from "@/app/book/page";
import { getBookingsList, cancelBooking } from "../requests";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

interface BookingViewDialogProps {
  viewData: BookingRecord;
  dialogOpen: boolean;
  handleDialogClose: () => void;
}

function BookingViewDialog({ viewData, dialogOpen, handleDialogClose }: BookingViewDialogProps) {
  const formatLocation = (location: string) => {
    if (!location?.includes("{")) {
      return location || "N/A";
    }

    try {
      const parsedLocation = JSON.parse(location);
      if (parsedLocation?.short_name?.includes("Airport")) {
        return parsedLocation.short_name;
      }

      const city = parsedLocation?.address?.split(",")?.slice(-5)?.[0]?.trim();
      if (parsedLocation?.short_name && city) {
        return `${parsedLocation.short_name}, ${city}`;
      }

      return parsedLocation?.short_name || location;
    } catch { // old style booking
      return location;
    }
  };

  const formatVia = (via: string | null | undefined) => {
    if (!via) {
      return "N/A";
    }

    if (!via.includes("[") && !via.includes("{")) {
      return via;
    }

    try {
      const parsedVia = JSON.parse(via);
      if (!Array.isArray(parsedVia) || parsedVia.length === 0) {
        return "N/A";
      }

      return parsedVia
        .map((stop) => {
          if (stop.short_name.includes("Airport")) {
            return stop.short_name;
          }
          const city = stop?.address?.split(",")?.slice(-5)?.[0]?.trim();
          return `${stop.short_name}, ${city}`;
        })
        .join("\n");
    } catch {
      return via;
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      aria-labelledby="booking-detail-title"
      aria-describedby="booking-detail-content"
    >
      <DialogTitle
        id="booking-detail-title"
        sx={{
          color: "white",
          textAlign: "center",
          fontSize: {
            md: 30,
            xs: 25,
          },
          fontWeight: "bold",
          bgcolor: "#2c2c2c",
          fontFamily: "aleo",
        }}
      >
        Booking Detail
        <FindInPageIcon sx={{ fontSize: 35, mb: 1, ml: 1, mr: -1 }} />
      </DialogTitle>
      <DialogContent id="booking-detail-content" dividers>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold", fontSize: 20 }}>
            Information about booking:
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Booking ID:
          </Typography>
          <Typography gutterBottom>{viewData.booking_id}</Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Additional Info:
          </Typography>
          <Typography gutterBottom textAlign="right">
            {viewData.additional_info || "N/A"}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Time Created:
          </Typography>
          <Typography gutterBottom textAlign="right">
            {viewData.time_created
              ? new Date(viewData.time_created).toLocaleString()
              : "N/A"}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Department:
          </Typography>
          <Typography gutterBottom textAlign="right">
            {viewData.department.dep_name}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Pickup:
          </Typography>
          <Typography gutterBottom textAlign="right">
            {formatLocation(viewData.trip.pickup_location)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Via:
          </Typography>
          <Typography gutterBottom textAlign="right" sx={{ whiteSpace: "pre-line" }}>
            {formatVia(viewData.trip.via)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Dropoff:
          </Typography>
          <Typography gutterBottom textAlign="right">
            {formatLocation(viewData.trip.dropoff_location)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Pickup Time:
          </Typography>
          <Typography gutterBottom textAlign="right">
            {viewData.trip.pickup_time
              ? new Date(viewData.trip.pickup_time).toLocaleString()
              : "N/A"}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              md: "400px",
              xs: "280px",
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Booking Status:
          </Typography>
          <Typography gutterBottom>{viewData.booking_status}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            color: "#2c2c2c",
            transition: "all 300ms",
            mr: 1,
            ":hover": { bgcolor: "#2c2c2c", color: "white" },
          }}
          onClick={handleDialogClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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
        {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
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
        {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

export const BookingManagePage = () => {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    _rerenderTable()
  }, []);

  const [bookingListData, setBookingListData] = useState<BookingRecord[]>([]);
  const [bookingListCount, setBookingListCount] = useState(0)
  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPaginationMeta((prev) => ({
      ...prev,
      page: newPage,
    }));
    setIsLoading(true);
    _rerenderTable(newPage, paginationMeta.pageSize);
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPaginationMeta({
      page: 0,
      pageSize: newPageSize,
    });
    setIsLoading(true)
    _rerenderTable(0, newPageSize)
  };

  // search form
  type SearchFormProps = {
    pickUpTimeFrom?: Date;
    pickUpTimeTo?: Date;
    from?: string;
    to?: string;
    bookingStatus?: string;
  };
  const [searchFormInput, setSearchFormInput] = useState<SearchFormProps>({
    pickUpTimeFrom: undefined,
    pickUpTimeTo: undefined,
    from: "",
    to: "",
    bookingStatus: "All",
  });
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const dateTimePickerFromAnchorRef = useRef<HTMLDivElement>(null);
  const dateTimePickerToAnchorRef = useRef<HTMLDivElement>(null);
  const [dateTimePickerFromOpen, setDateTimePickerFromOpen] = useState(false);
  const [dateTimePickerToOpen, setDateTimePickerToOpen] = useState(false);

  const handleSubmitSearchForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (
      searchFormInput.pickUpTimeTo &&
      searchFormInput.pickUpTimeFrom &&
      searchFormInput.pickUpTimeFrom > searchFormInput.pickUpTimeTo
    ) {
      return;
    }

    setIsSearchSubmitted(true);
    setPaginationMeta({
      page: 0,
      pageSize: paginationMeta.pageSize,
    });
    setIsLoading(true)
    _rerenderTable(0, paginationMeta.pageSize)
  }

  const [bookDetail, setBookDetail] = useState<BookingRecord>();
  const [bookDetailDialogOpen, setBookDetailDialogOpen] = useState(false);
  const handleViewBooking = (data: BookingRecord) => {
    setBookDetail(data);
    setBookDetailDialogOpen(true);
  };

  const [editBookDialogOpen, setEditBookDialogOpen] = useState(false);
  const handleEditBooking = (data: BookingRecord) => {
    setBookDetail(data);
    setEditBookDialogOpen(true);
  };
  const handleEditDialogClose = () => {
    setEditBookDialogOpen(false);
    setIsLoading(true)
    _rerenderTable()
  }

  const [confirmCancelDialogOpen, setConfirmCancelDialogOpen] = useState(false);
  const [toCancelBookingId, setToCancelBookingId] = useState<number>();

  const handleCancelBooking = (row: BookingRecord) => {
    setToCancelBookingId(row.booking_id);
    setConfirmCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    cancelBooking(toCancelBookingId!).then((res) => {
      setConfirmCancelDialogOpen(false);
      if (res.status === 200) {
        setIsLoading(true)
        _rerenderTable()
      }
    });
  };

  const _rerenderTable = (page: number = paginationMeta.page, pageSize: number = paginationMeta.pageSize) => {
    getBookingsList(page, pageSize, {
      ...searchFormInput,
      pickUpTimeFrom: searchFormInput.pickUpTimeFrom
        ? searchFormInput.pickUpTimeFrom.toISOString()
        : "",
      pickUpTimeTo: searchFormInput.pickUpTimeTo
        ? searchFormInput.pickUpTimeTo.toISOString()
        : "",
      bookingStatus:
        searchFormInput?.bookingStatus === "All"
          ? ""
          : searchFormInput?.bookingStatus,
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setBookingListData(data.bookings);
          setBookingListCount(data.totalNum);
          setIsLoading(false);
        });
      }
    });
  }

  return (<>
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-aleo md:text-3xl font-semibold text-shadow-lg/20 py-2 pr-4">
            Bookings
          </h1>
        </div>

        <Box
          component="form"
          onSubmit={handleSubmitSearchForm}
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            label="From"
            id="searchFromInput"
            value={searchFormInput.from}
            onChange={(e) => {
              setSearchFormInput({
                ...searchFormInput,
                from: e.target.value,
              });
            }}
            size="small"
            sx={{ minWidth: 140 }}
          />
          <TextField
            label="To"
            id="searchToInput"
            value={searchFormInput.to}
            onChange={(e) => {
              setSearchFormInput({ ...searchFormInput, to: e.target.value });
            }}
            size="small"
            sx={{ minWidth: 140 }}
          />
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="searchBookingStatusInputLabel">
              Booking Status
            </InputLabel>
            <Select
              labelId="searchBookingStatusInputLabel"
              label="Booking Status"
              id="searchBookingStatusInput"
              value={searchFormInput.bookingStatus}
              onChange={(e) => {
                setSearchFormInput({
                  ...searchFormInput,
                  bookingStatus: e.target.value,
                });
              }}
              size="small"
            >
              <MenuItem value={"All"} key={"All"}>
                All
              </MenuItem>
              {bookingStatus.map((e) => {
                return (
                  <MenuItem value={e} key={e}>
                    {e}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            onClick={() => setDateTimePickerFromOpen(true)}
            label="Pick Up Date From"
            size="small"
            sx={{ minWidth: 200 }}
            ref={dateTimePickerFromAnchorRef}
            defaultValue={searchFormInput.pickUpTimeFrom?.toDateString()}
            slotProps={{
              inputLabel: {
                shrink: searchFormInput.pickUpTimeFrom !== undefined,
              },
            }}
          />
          {searchFormInput.pickUpTimeFrom && (
            <IconButton
              size="small"
              sx={{ px: 1.3, mx: -2 }}
              onClick={() => {
                setSearchFormInput({
                  ...searchFormInput,
                  pickUpTimeFrom: undefined,
                });
                setIsSearchSubmitted(false);
              }}
            >
              <CancelIcon fontSize="small" sx={{ color: "red" }} />
            </IconButton>
          )}
          <TextField
            onClick={() => setDateTimePickerToOpen(true)}
            label="Pick Up Date To"
            size="small"
            sx={{ minWidth: 200 }}
            ref={dateTimePickerToAnchorRef}
            defaultValue={searchFormInput.pickUpTimeTo?.toDateString()}
            slotProps={{
              inputLabel: {
                shrink: searchFormInput.pickUpTimeTo !== undefined,
              },
            }}
          />
          {searchFormInput.pickUpTimeTo && (
            <IconButton
              size="small"
              sx={{ px: 1.3, mx: -2 }}
              onClick={() => {
                setSearchFormInput({
                  ...searchFormInput,
                  pickUpTimeTo: undefined,
                });
                setIsSearchSubmitted(false);
              }}
            >
              <CancelIcon fontSize="small" sx={{ color: "red" }} />
            </IconButton>
          )}
          <DateTimePicker
            open={dateTimePickerFromOpen}
            onClose={() => setDateTimePickerFromOpen(false)}
            anchorEl={dateTimePickerFromAnchorRef}
            selectedDate={searchFormInput.pickUpTimeFrom || null}
            onDateChange={(date) => {
              setSearchFormInput({ ...searchFormInput, pickUpTimeFrom: date });
              setIsSearchSubmitted(false);
            }}
            locale={enLocale}
          />
          <DateTimePicker
            open={dateTimePickerToOpen}
            onClose={() => setDateTimePickerToOpen(false)}
            anchorEl={dateTimePickerToAnchorRef}
            selectedDate={searchFormInput.pickUpTimeTo || null}
            onDateChange={(date) => {
              setSearchFormInput({ ...searchFormInput, pickUpTimeTo: date });
              setIsSearchSubmitted(false);
            }}
            locale={enLocale}
          />
          <CustomizedButton title="Search" type="warning" click={() => { }} />
        </Box>
      </div>
    </div>

    {isSearchSubmitted &&
            (searchFormInput.pickUpTimeFrom && searchFormInput.pickUpTimeTo ? (
              <p className="font-aleo text-gray-700 mb-4 text-sm bg-blue-50 border-l-4 border-blue-400 py-2 px-4 rounded w-fit">
                Showing Bookings from{" "}
                <strong>
                  {searchFormInput.pickUpTimeFrom.toISOString().split("T")[0]}
                </strong>{" "}
                to{" "}
                <strong>
                  {searchFormInput.pickUpTimeTo.toISOString().split("T")[0]}
                </strong>
              </p>
            ) : searchFormInput.pickUpTimeFrom ? (
              <p className="font-aleo text-gray-700 mb-4 text-sm bg-blue-50 border-l-4 border-blue-400 py-2 px-4 rounded w-fit">
                Showing Bookings from{" "}
                <strong>
                  {searchFormInput.pickUpTimeFrom.toISOString().split("T")[0]}
                </strong>{" "}
                to <strong>{new Date().toISOString().split("T")[0]}</strong>
              </p>
            ) : searchFormInput.pickUpTimeTo ? (
              <p className="font-aleo text-gray-700 mb-4 text-sm bg-blue-50 border-l-4 border-blue-400 py-2 px-4 rounded w-fit">
                Showing Bookings up to{" "}
                <strong>
                  {searchFormInput.pickUpTimeTo.toISOString().split("T")[0]}
                </strong>
              </p>
            ) : null)}

    {isLoading ? (
      <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}>
        Getting booking data...
      </Typography>
    ) : bookingListData.length === 0 ? (
      <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}>
        No bookings to show.
      </Typography>
    ) : (
      <div className="mt-7">
        <BookingTable
          data={bookingListData}
          count={bookingListCount}
          page={paginationMeta.page}
          pageSize={paginationMeta.pageSize}
          onPageChange={handleChangePage}
          onPageSizeChange={handleChangePageSize}
          onViewDetails={handleViewBooking}
          onEditBooking={handleEditBooking}
          onCancelBooking={handleCancelBooking}
          ActionsComponent={TablePaginationActions}
        />
      </div>
    )}

    {bookDetail && (
      <BookingViewDialog
        viewData={bookDetail}
        dialogOpen={bookDetailDialogOpen}
        handleDialogClose={() => setBookDetailDialogOpen(false)}
      />
    )}

    <Dialog
      onClose={handleEditDialogClose}
      aria-labelledby="customized-dialog-title"
      open={editBookDialogOpen}
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          fontFamily: "inter",
          fontWeight: "bold",
          bgcolor: "#2c2c2c",
          color: "white",
          textAlign: "center",
          fontSize: 28,
        }}
        id="customized-dialog-title"
      >
        Edit Booking
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleEditDialogClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <BookingPage />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            color: "#2c2c2c",
            transition: "all 300ms",
            mr: 1,
            ":hover": { bgcolor: "#2c2c2c", color: "white" },
          }}
          onClick={handleEditDialogClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>

    <ConfirmDialog
      open={confirmCancelDialogOpen}
      dialogTitle="Cancel Booking"
      confirmMessage="Are you sure you want to cancel this booking?"
      confirmCallBack={handleConfirmCancel}
      cancelCallBack={() => setConfirmCancelDialogOpen(false)}
    />
  </>)
}

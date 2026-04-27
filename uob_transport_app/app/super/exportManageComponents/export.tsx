"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  Cancel as CancelIcon,
  FindInPage as FindInPageIcon,
  SystemUpdateAlt,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import { BookingRecord } from "@/model/models";
import { BookingTable } from "@/components/SuperBookingsTable";
import { DateTimePicker } from "@/components/datetimePicker/DateTimePicker";
import { enLocale } from "@/components/datetimePicker/locale";
import ConfirmDialog from "@/components/confirmDIalog";
import CustomizedButton from "@/components/CustomizedButton";
import { getBookingsList, cancelBooking } from "../requests";
import { redirect } from "next/navigation";
import { easyGetRequest } from "@/utils/easyRequest";

interface DepCount {
  dep_id: number;
  dep_name: string;
  count: number;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

interface BookingViewDialogProps {
  viewData: BookingRecord;
  dialogOpen: boolean;
  handleDialogClose: () => void;
}

function BookingViewDialog({
  viewData,
  dialogOpen,
  handleDialogClose,
}: BookingViewDialogProps) {
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
    } catch {
      // old style booking
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
            {formatLocation(viewData.trip.pickup_location as unknown as string)}
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
          <Typography
            gutterBottom
            textAlign="right"
            sx={{ whiteSpace: "pre-line" }}
          >
            {formatVia(viewData.trip.via as unknown as string)}
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
            {formatLocation(
              viewData.trip.dropoff_location as unknown as string,
            )}
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
          <Chip
            size="small"
            label={viewData.booking_status}
            color={
              viewData.booking_status === "Approved" ? "success" : "warning" 
            }
            variant="filled"
            sx={{ textTransform: "capitalize", fontWeight: 600 }}
          />
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

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
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

export default function ExportPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [snackBar, setSnackBar] = useState(false);
  const [depCountData, setDepCountData] = useState<null | DepCount[]>(null);

  // export selection variables
  const [selectedBookingIds, setSelectedBookingIds] = useState<number[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [allChecked, setAllChecked] = useState(false);

  const handleCheck = (id: number) => {
    let newSelected: number[] = [];
    if (selectedBookingIds.includes(id)) {
      newSelected = selectedBookingIds.filter((e) => e !== id);
    } else {
      newSelected = [...selectedBookingIds, id];
    }
    setSelectedBookingIds(newSelected);
  };

  const handleCheckAll = async (checked: boolean) => {
    if (checked) {
      const res = await fetch("/api/check_all_booking_ids", {
        method: "POST",
        body: JSON.stringify({
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
        }),
      });

      if (res.status === 200) {
        const data: number[] = await res.json();
        setSelectedBookingIds(data);
      }
      setAllChecked(true);
    } else {
      setAllChecked(false);
      setSelectedBookingIds([]);
    }
  };

  const handleClearSelected = () => {
    setAllChecked(false);
    setSelectedBookingIds([]);
  };

  useEffect(() => {
    setSelectedCount(selectedBookingIds.length);
  }, [selectedBookingIds]);


  const downloadCSV = (res : Response, title: string) => {
    res.blob().then((blob) => {
      // From https://mojoauth.com/parse-and-generate-formats/parse-and-generate-csv-with-nextjs/#client-side-csv-generation-and-download
      // Create a URL for the blob data and trigger the download.
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${title}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
};

  // Export button handlers
  const handleDepartmentExport = async () => {
    await fetch("/api/export_bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ depId: exportDepId }),
    }).then((res) => {
      if (res.status === 200) {
        const title = selectedDepartment ? selectedDepartment.dep_name + "_Department" : "Department_Bookings"
        downloadCSV(res, title);
      }
    });
  }

  const handleSelectedExport = async () => {
    // selectedBookingIds variable is an array containing all the selected booking ids
    await fetch("/api/export_bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingIds: selectedBookingIds }),
    }).then((res) => {
      if (res.status === 200) {
        downloadCSV(res, "Selected_Bookings");
      }
    });
  };
  
  useEffect(() => {
    _rerenderTable();
  }, []);

  useEffect(() => {
    easyGetRequest("dep_booking_count", {}).then(async (res) => {
      if (res.status === 200) {
        setDepCountData(await res.json());
      } else {
        setDepCountData(null);
      }
    });
  }, []);

  const [bookingListData, setBookingListData] = useState<BookingRecord[]>([]);
  const [bookingListCount, setBookingListCount] = useState(0);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPaginationMeta((prev) => ({
      ...prev,
      page: newPage,
    }));
    setIsLoading(true);
    _rerenderTable(newPage, paginationMeta.pageSize);
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPaginationMeta({
      page: 0,
      pageSize: newPageSize,
    });
    setIsLoading(true);
    _rerenderTable(0, newPageSize);
  };

  // search form
  type SearchFormProps = {
    pickUpTimeFrom?: Date;
    pickUpTimeTo?: Date;
    from?: string;
    to?: string;
    bookingStatus?: string;
    department?: string;
  };
  const [searchFormInput, setSearchFormInput] = useState<SearchFormProps>({
    pickUpTimeFrom: undefined,
    pickUpTimeTo: undefined,
    from: "",
    to: "",
    bookingStatus: "All",
    department: "",
  });

  const handleClear = () => {
    const searchInput = {
      pickUpTimeFrom: undefined,
      pickUpTimeTo: undefined,
      from: "",
      to: "",
      bookingStatus: "All",
      department: "",
    }
    setSearchFormInput(searchInput);

    setIsLoading(true);
    setIsSearchSubmitted(false);
    _rerenderTable(0, paginationMeta.pageSize, searchInput);
  };

  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  useEffect(() => {
    // auto re-render the table on selections and clearing
    _rerenderTable(paginationMeta.page, paginationMeta.pageSize);
  }, [searchFormInput.bookingStatus, paginationMeta.page, paginationMeta.pageSize]);

  const dateTimePickerFromAnchorRef = useRef<HTMLDivElement>(null);
  const dateTimePickerToAnchorRef = useRef<HTMLDivElement>(null);
  const [dateTimePickerFromOpen, setDateTimePickerFromOpen] = useState(false);
  const [dateTimePickerToOpen, setDateTimePickerToOpen] = useState(false);

  const handleSubmitSearchForm = (e: React.SubmitEvent) => {
    e.preventDefault();

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
    setIsLoading(true);
    _rerenderTable(0, paginationMeta.pageSize);
  };

  const [bookDetail, setBookDetail] = useState<BookingRecord>();
  const [bookDetailDialogOpen, setBookDetailDialogOpen] = useState(false);

  // selected export department id and name
  const [exportDepId, setExportDepId] = useState(-1);
  const [selectedDepartment, setSelectedDepartment] = useState<DepCount | null>(
    null,
  );

  const handleViewBooking = (data: BookingRecord) => {
    setBookDetail(data);
    setBookDetailDialogOpen(true);
  };

  const handleEditBooking = (data: BookingRecord) => {
    redirect(`/book?update=${data.booking_id}`);
  };

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
        setIsLoading(true);
        _rerenderTable();
      }
    });
  };

  const _rerenderTable = (
    page: number = paginationMeta.page,
    pageSize: number = paginationMeta.pageSize,
    updatedData: SearchFormProps | null = null,
  ) => {
    const searchInput = updatedData || searchFormInput;
    getBookingsList(page, pageSize, true, {
      ...searchInput,
      pickUpTimeFrom: searchInput.pickUpTimeFrom
        ? searchInput.pickUpTimeFrom.toISOString()
        : "",
      pickUpTimeTo: searchInput.pickUpTimeTo
        ? searchInput.pickUpTimeTo.toISOString()
        : "",
      bookingStatus:
        searchInput?.bookingStatus === "All"
          ? ""
          : searchInput?.bookingStatus,
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setBookingListData(data.bookings);
          setBookingListCount(data.totalNum);
          setIsLoading(false);
        });
      }
    });
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h1 className="font-aleo text-2xl font-semibold text-shadow-lg/20 py-2 pr-4">
              Export Bookings
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
              label="Department"
              size="small"
              id="searchFormInput"
              sx={{ minWidth: 140 }}
              value={searchFormInput.department}
              onChange={(e) => {
                setSearchFormInput({
                  ...searchFormInput,
                  department: e.target.value,
                });
              }}
            ></TextField>
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
                {["Pending", "Approved"].map((e) => {
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
                setSearchFormInput({
                  ...searchFormInput,
                  pickUpTimeFrom: date,
                });
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
            <Button
              sx={{
                textTransform: "none",
                bgcolor: "white",
                border: "2px solid #2c2c2c",
                borderRadius: 2,
                color: "#2c2c2c",
                "&:hover": {
                  scale: 1.04,
                },
                transition: "all ease 0.2s",
              }}
              onClick={handleClear}
            >
              Clear
            </Button>
            <CustomizedButton title="Search" type="warning" click={() => {}} />
          </Box>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
        <div className="flex gap-3 flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <SystemUpdateAlt sx={{ fontSize: 24 }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Export by department
              </p>
              <p className="text-xs text-gray-600">
                Choose a department to export the bookings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {selectedDepartment && (
              <Badge badgeContent={selectedDepartment.count} color="success">
                <Tooltip
                  title={`Export all ${selectedDepartment.dep_name} bookings`}
                  arrow
                >
                  <IconButton
                    size="small"
                    className="border! border-emerald-500! bg-white! text-emerald-600! transition-colors ease-in-out duration-150 hover:bg-emerald-600! hover:text-white!"
                    onClick={handleDepartmentExport}
                  >
                    <SystemUpdateAlt sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </Badge>
            )}
            <FormControl size="small" sx={{ minWidth: 280 }}>
              <Select
                value={selectedDepartment?.dep_name || ""}
                displayEmpty
                renderValue={(value) =>
                  value ? value : "Select a department to export"
                }
                onChange={(e) => {
                  const department = depCountData?.find(
                    (d) => d.dep_name === e.target.value,
                  );

                  if (department) {
                    setExportDepId(department.dep_id);
                    setSelectedDepartment(department);
                  }
                }}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#22c55e",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#22c55e",
                  },
                }}
              >
                {depCountData &&
                  depCountData.map((department) => {
                    return (
                      <MenuItem
                        key={department.dep_id}
                        value={department.dep_name}
                        sx={{
                          borderLeft: "5px solid transparent",
                          transition:
                            "background-color 150ms ease, border-left-color 150ms ease, padding-left 150ms ease",
                          "&:hover": {
                            borderLeft: "5px solid green",
                            bgcolor: "rgba(34, 197, 94, 0.08)",
                            pl: 1.5,
                          },
                        }}
                      >
                        <span className="flex w-full items-center justify-between gap-3">
                          <span>{department.dep_name}</span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                            {department.count}
                            <SystemUpdateAlt sx={{ fontSize: 18 }} />
                          </span>
                        </span>
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {(selectedBookingIds.length !== 0 || allChecked) && (
        <div className="mb-4 mt-4 flex items-center gap-3 justify-between rounded-xl border border-emerald-200 bg-green-50 px-4 py-3 shadow-sm w-1/4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-950">
                Ready to export
              </p>
              <p className="text-sm text-slate-600">
                Export{" "}
                {allChecked
                  ? `all ${selectedCount}`
                  : `${selectedCount} selected`}{" "}
                bookings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              variant="outlined"
              onClick={handleClearSelected}
              sx={{
                borderColor: "#10b981",
                color: "#065f46",
                textTransform: "none",
                fontWeight: 600,
                ":hover": {
                  borderColor: "#059669",
                  bgcolor: "rgba(16, 185, 129, 0.08)",
                },
              }}
            >
              Clear
            </Button>
            <Tooltip title="Export selected bookings">
              <IconButton
                size="small"
                className="border! border-emerald-500! bg-white! text-emerald-600! transition-colors hover:bg-emerald-600! hover:text-white!"
                onClick={handleSelectedExport}
              >
                <SystemUpdateAlt sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}

      {isSearchSubmitted &&
        (searchFormInput.pickUpTimeFrom && searchFormInput.pickUpTimeTo ? (
          <p className="font-aleo text-gray-700 mb-4 text-sm bg-blue-50 border-l-4 border-blue-400 py-2 px-4 rounded w-fit mt-4">
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
          <p className="font-aleo text-gray-700 mb-4 text-sm bg-blue-50 border-l-4 border-blue-400 py-2 px-4 rounded w-fit mt-4">
            Showing Bookings from{" "}
            <strong>
              {searchFormInput.pickUpTimeFrom.toISOString().split("T")[0]}
            </strong>{" "}
            to <strong>{new Date().toISOString().split("T")[0]}</strong>
          </p>
        ) : searchFormInput.pickUpTimeTo ? (
          <p className="font-aleo text-gray-700 mb-4 text-sm bg-blue-50 border-l-4 border-blue-400 py-2 px-4 rounded w-fit mt-4">
            Showing Bookings up to{" "}
            <strong>
              {searchFormInput.pickUpTimeTo.toISOString().split("T")[0]}
            </strong>
          </p>
        ) : null)}

      {isLoading ? (
        <Typography
          sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
        >
          Getting booking data...
        </Typography>
      ) : bookingListData.length === 0 ? (
        <Typography
          sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
        >
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
            onPriceAttached={() => {
              setIsLoading(true);
              _rerenderTable();
            }}
            openSnackBar={() => {
              setSnackBar(true);
            }}
            ActionsComponent={TablePaginationActions}
            isExport={true}
            handleCheckAll={handleCheckAll}
            handleCheck={handleCheck}
            selectedBookingIds={selectedBookingIds}
            allChecked={allChecked}
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

      <Snackbar
        open={snackBar}
        autoHideDuration={3000}
        onClose={() => {
          setSnackBar(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setSnackBar(false);
          }}
          severity="success"
          variant="filled"
        >
          Price has been successfully attached and an email sent to the finance staffs.
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={confirmCancelDialogOpen}
        dialogTitle="Cancel Booking"
        confirmMessage="Are you sure you want to cancel this booking?"
        confirmCallBack={handleConfirmCancel}
        cancelCallBack={() => setConfirmCancelDialogOpen(false)}
      />
    </>
  );
}

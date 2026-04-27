"use client";

import { useRouter, redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button, TableHead } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import SummarizeIcon from "@mui/icons-material/Summarize";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { BookingRecord } from "@/model/models";
import { cancelBooking, getUserBookingList } from "./requests";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CustomizedButton from "@/components/CustomizedButton";
import { StyledTableCell } from "@/components/StyledTableCell";
import { Snackbar, Alert } from "@mui/material";
import ConfirmDialog from "@/components/confirmDIalog";
import ViewDialog from "./(components)/viewDialog";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { bookingStatus } from "./constants";
import { TablePaginationActions } from "@/components/paginationActions";
import { motion } from "framer-motion";
import Image from "next/image";
import { DateTimePicker } from "@/components/datetimePicker/DateTimePicker";
import { enLocale } from "@/components/datetimePicker/locale";

const Page = () => {
  // Get NextAuth Session.
  const { status, data } = useSession();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    _getBookingListData(0, 10);
  }, [status, router]);

  const handleClick = () => {
    router.push("/book");
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setIsLoading(true);
    setPaginationMeta({
      ...paginationMeta,
      page: newPage,
    });
    _getBookingListData(newPage, paginationMeta.pageSize);
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setIsLoading(true);
    const newPageSize = parseInt(event.target.value, 10);
    setPaginationMeta({
      page: 0,
      pageSize: newPageSize,
    });
    _getBookingListData(0, newPageSize);
  };

  const [bookingListData, setBookingListData] = useState<BookingRecord[]>([]);
  const [bookingListCount, setBookingListCount] = useState(0);

  // Cancel booking
  const [cancelBookDialogOpen, setCancelBookDialogOpen] = useState(false);
  const [toCancelBookingId, setToCancelBookingId] = useState<number>();

  const handleCancelBooking = (row: BookingRecord) => {
    setToCancelBookingId(row.booking_id);
    setCancelBookDialogOpen(true);
  };

  const handleCancelDialogClose = () => {
    setCancelBookDialogOpen(false);
    setToCancelBookingId(undefined);
  };

  const handleConfirmCancel = () => {
    cancelBooking(toCancelBookingId!).then((res) => {
      setCancelBookDialogOpen(false);
      if (res.status === 200) {
        setSnackbarState({
          open: true,
          status: "success",
          message: "Successfully Cancelled!",
        });
        setBookingListData(
          bookingListData.map((ele) => {
            if (ele.booking_id === toCancelBookingId) {
              ele.booking_status = "Cancelled";
            }
            return ele;
          }),
        );
      } else {
        setSnackbarState({
          open: true,
          status: "error",
          message: "Cancel failed, please try again later!",
        });
      }
    });
  };

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    status: "success",
    message: "",
  });

  const [notificationSnackbarState, setNotificationSnackbarState] = useState({
    open: false,
    status: "info",
    message: "",
  });

  const handleCloseSnackbarState = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
  };

  const handleCloseNotificationSnackbarState = () => {
    setNotificationSnackbarState({
      ...notificationSnackbarState,
      open: false,
    });
  };

  // View Dialog
  const [bookDetailDialogOpen, setBookDetailDialogOpen] = useState(false);
  const [bookDetail, setBookDetail] = useState<BookingRecord>();

  const handleViewDialogOpen = (data: BookingRecord) => {
    setBookDetail(data);
    setBookDetailDialogOpen(true);
  };
  const handleViewDialogClose = () => {
    setBookDetailDialogOpen(false);
  };

  // Edit Dialog
  const handleEditTrigger = (data: BookingRecord) => {
    redirect(`/book?update=${data.booking_id}`);
  };

  // Search form state
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
  const [noFilterBooking, setNoFilterBooking] = useState(false);

  const dateTimePickerFromAnchorRef = useRef<HTMLDivElement>(null);
  const dateTimePickerToAnchorRef = useRef<HTMLDivElement>(null);
  const [dateTimePickerFromOpen, setDateTimePickerFromOpen] = useState(false);
  const [dateTimePickerToOpen, setDateTimePickerToOpen] = useState(false);

  const handleSubmitSearchForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      searchFormInput.pickUpTimeTo &&
      searchFormInput.pickUpTimeFrom &&
      searchFormInput.pickUpTimeFrom > searchFormInput.pickUpTimeTo
    ) {
      setSnackbarState({
        open: true,
        status: "error",
        message: "From Date cannot be later than the To Date!",
      });
      return;
    }

    setIsSearchSubmitted(true);
    setIsLoading(true);
    setPaginationMeta({
      page: 0,
      pageSize: paginationMeta.pageSize,
    });
    _getBookingListData(0, paginationMeta.pageSize, true);
  };

   // Taken from next.js docs
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i += 1) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  const handleEnableNotifications = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone); // IOS specific check
  
    if (!window.isSecureContext) {
      return;
    }
  
    if (!isStandaloneMode) {
      setNotificationSnackbarState({
        open: true,
        status: "warning",
        message: "Add this app to your home screen to enable notifications.",
      });
      return;
    }
  
    if (!("Notification" in window)) {
      setNotificationSnackbarState({
        open: true,
        status: "error",
        message: "Notifications are not supported on this device/browser.",
      });
      return;
    }
  
    const permission = await Notification.requestPermission();
  
    if (permission !== "granted") {
      setNotificationSnackbarState({
        open: true,
        status: "warning",
        message: "Notification permission was denied.",
      });
      return;
    }

    setNotificationSnackbarState({
      open: true,
      status: "success",
      message: "Notification permission granted. Enabling push notifications...",
    });
  
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      setNotificationSnackbarState({
        open: true,
        status: "error",
        message: "Notication enable failed. Please try again.",
      });
      return;
    }
  
    await navigator.serviceWorker.register("/sw.js");
    const reg = await navigator.serviceWorker.ready;
  
    let subscription = await reg.pushManager.getSubscription();
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }
  
    const response = await fetch("/api/create_subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify({ subscription }),
    });
  
    if (!response.ok) {
      console.error("Subscription failed");
      setNotificationSnackbarState({
        open: true,
        status: "error",
        message: "Notication enable failed. Please try again.",
      });
      return;
    }

    setNotificationSnackbarState({
      open: true,
      status: "success",
      message: "Notifications enabled successfully.",
    });
  };

  const _getBookingListData = (
    page: number,
    pageSize: number,
    submittedSearch: boolean = isSearchSubmitted,
    searchInput: SearchFormProps = searchFormInput,
  ) => {
    const search = searchInput || searchFormInput;
    getUserBookingList(page, pageSize, {
      ...search,
      pickUpTimeFrom: search.pickUpTimeFrom
        ? search.pickUpTimeFrom.toISOString()
        : "",
      pickUpTimeTo: search.pickUpTimeTo
        ? search.pickUpTimeTo.toISOString()
        : "",
      bookingStatus:
        search?.bookingStatus === "All"
          ? ""
          : search?.bookingStatus,
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setBookingListData(data.bookings);
          setBookingListCount(data.totalNum);
          setNoFilterBooking(data.totalNum === 0 && submittedSearch);
          setIsLoading(false);
        });
      }
    });
  };

  const handleClear = () => {
    const search = {
      pickUpTimeFrom: undefined,
      pickUpTimeTo: undefined,
      from: "",
      to: "",
      bookingStatus: "All"
    }
    setSearchFormInput(search);
    setIsLoading(true);
    _getBookingListData(0, paginationMeta.pageSize, true, search);
  };
  
  useEffect(() => {
    _getBookingListData(paginationMeta.page, paginationMeta.pageSize, false);
  }, [searchFormInput.bookingStatus])

  // Do nothing if we get a status. Await for this check to be carried out in useEffect.
  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex flex-col items-center font-inter p-4">
      <motion.div
        className="text-[32px] mt-5 font-bold font-aleo text-center text-shadow-md/10"
        initial={{ opacity: 0, y: 6, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Welcome, {data?.user.name.split(" ")[0]}!
        <p className="text-gray-600 text-lg font-normal">
          To Your Booking Space
        </p>
        {Notification.permission !== "granted" && 
          <Button sx={{
             textTransform: "none",
              bgcolor: "white",
              border: "2px solid #2c2c2c",
              borderRadius: 2,
              color: "#2c2c2c",
              height: { xs: 35, md: "100%"},
              ":hover": {
                scale: 1.02
              },
              transition: "all ease 0.2s"
            }}
            onClick={handleEnableNotifications}
            >
              <NotificationsNoneIcon sx={{ fontSize: 22, mr: 0.5 }}/>
              Enable Notifications
          </Button>
        }
        
      </motion.div>
      {data?.user.account_type === "finance_staff" ? (
        <div className="flex md:flex-row flex-col mt-5 gap-10 text-sm max-w-6xl">
          <motion.div
            className="bg-white flex flex-col items-center rounded-lg overflow-hidden px-4 text-gray-800 border-l-6 border-l-orange-500 drop-shadow-md/20 flex-1 cursor-pointer"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.24 }}
            whileHover={{
              y: -6,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            onClick={() => redirect("/dep-dashboard")}
          >
            <Image
              src="/manage.jpg"
              width={105}
              height={120}
              alt="person managing data"
              className="object-cover mt-1"
            />
            <div className="leading-relaxed px-4 py-3 text-center">
              Efficiently <strong>manage</strong> all your department&apos;s{" "}
              <strong>bookings</strong> with a <strong>dashboard </strong>
              designed to make management a breeze.
            </div>
          </motion.div>
          <motion.div
            className="bg-white flex flex-col items-center rounded-lg overflow-hidden px-4 text-gray-800 border-l-6 border-l-blue-500 drop-shadow-md/20 flex-1 cursor-pointer"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.48 }}
            whileHover={{
              y: -6,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            onClick={() => redirect("/dep-dashboard")}
          >
            <Image
              src="/Checklist.jpg"
              width={160}
              height={120}
              alt="person managing data"
              className="object-cover mt-1"
            />
            <div className="leading-relaxed px-4 py-3 text-center">
              <strong>View</strong> booking details, <strong>receive</strong>{" "}
              email notifications, and <strong>approve</strong> or reject
              requests with PO numbers.
            </div>
          </motion.div>
          <motion.div
            className="bg-white flex flex-col items-center rounded-lg overflow-hidden px-4 text-gray-800 border-l-6 border-l-yellow-500 drop-shadow-md/20 flex-1 cursor-pointer"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.72 }}
            whileHover={{
              y: -6,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            }}
            onClick={() => redirect("/book")}
          >
            <Image
              src="/book.jpg"
              width={140}
              height={120}
              alt="person booking a taxi"
              className="object-cover mt-2"
            />
            <div className="leading-relaxed px-4 py-3 text-center mt-1.5">
              <strong>Everyone</strong> gets to book, even if you are a staff.{" "}
              <strong> Book</strong> a luxurious chauffeur service from any
              destination in <strong>Bristol</strong>.
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex md:flex-row flex-col mt-5 gap-10 max-w-6xl">
          <motion.div
            className="bg-white flex items-center rounded-lg overflow-hidden px-4 text-gray-800 border-l-6 border-l-yellow-500 drop-shadow-md/20"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.24 }}
          >
            <Image
              src="/book.jpg"
              width={120}
              height={120}
              alt="person booking a taxi"
            ></Image>
            <p className="px-2 py-7 text-sm leading-snug max-w-55">
              <strong>Book</strong> a luxurious chauffeur service from any
              destination in <strong>Bristol</strong>.
            </p>
          </motion.div>
          <motion.div
            className="bg-white flex items-center rounded-lg overflow-hidden px-4 text-gray-800 border-l-6 border-l-gray-500 drop-shadow-md/20"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.48 }}
          >
            <Image
              src="/status.png"
              width={110}
              height={120}
              alt="check status"
              className="drop-shadow-lg/20"
            ></Image>
            <p className="px-4 py-6 text-sm leading-snug max-w-55">
              <strong>Track</strong> the status of your bookings and{" "}
              <strong>receive email</strong> updates.
            </p>
          </motion.div>
          <motion.div
            className="bg-white flex items-center rounded-lg overflow-hidden px-4 text-gray-800 border-l-6 border-l-pink-300 drop-shadow-md/20"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.72 }}
          >
            <Image
              src="/check.jpg"
              width={110}
              height={120}
              alt="view booking details"
            ></Image>
            <p className="px-2 pl-3 py-6 text-sm leading-snug max-w-55">
              <strong>View</strong> full booking details, and{" "}
              <strong>cancel</strong> or <strong>edit</strong> them anytime as
              needed.
            </p>
          </motion.div>
        </div>
      )}
      {bookingListData.length === 0 && !noFilterBooking && !isLoading && searchFormInput.bookingStatus === "All" ? (
        <motion.div
          className="bg-white shadow-lg/20 rounded-lg p-10 md:p-12 w-full max-w-6xl my-15 mt-13 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        >
          <div className="flex flex-col items-center text-center max-w-md">
            <div className="mb-6 text-gray-300">
              <SummarizeIcon sx={{ fontSize: 100 }} />
            </div>
            <h2 className="text-2xl font-bold font-aleo text-gray-700 mb-3">
              No Bookings Yet
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Your bookings will appear here once you make them. Start your
              journey by creating your first booking!
            </p>
            <CustomizedButton
              title="+ Create Your First Booking"
              type="warning"
              click={handleClick}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white shadow-lg/20 rounded-lg p-6 md:p-8 w-full max-w-6xl my-15 mt-13"
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        >
          <div className="flex justify-between mb-6">
            <h1 className="font-aleo text-2xl sm:text-3xl font-semibold text-shadow-lg/20">
              MY BOOKINGS
            </h1>
            <CustomizedButton
              title="+ New Booking"
              type="warning"
              click={handleClick}
            />
          </div>

          <Box
            component="form"
            onSubmit={handleSubmitSearchForm}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2.5,
              marginBottom: 3,
            }}
          >
            <TextField
              fullWidth
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
              sx={{ minWidth: 150 }}
            />
            <TextField
              fullWidth
              label="To"
              id="searchToInput"
              value={searchFormInput.to}
              onChange={(e) => {
                setSearchFormInput({ ...searchFormInput, to: e.target.value });
              }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="searchBookingStatusInputLabel" size="small">
                Booking Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
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
            <div className="flex gap-5 md:w-4/5 w-full">
              <TextField
                fullWidth
                onClick={() => setDateTimePickerFromOpen(true)}
                label="Pick Up Date From"
                size="small"
                sx={{ minWidth: 150 }}
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
            </div>

            <div className="flex gap-5 md:w-4/5 w-full">
              <TextField
                fullWidth
                onClick={() => setDateTimePickerToOpen(true)}
                label="Pick Up Date To"
                size="small"
                sx={{ minWidth: 150 }}
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
            </div>

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
            <Button sx={{
              textTransform: "none",
              bgcolor: "white",
              border: "2px solid #2c2c2c",
              borderRadius: 2,
              color: "#2c2c2c",
              "&:hover": {
                scale: 1.04
              },
              transition: "all ease 0.2s",
              height: { xs: 35, md: "100%"}
            }}
            onClick={handleClear}
            >
              Clear
            </Button>
            <CustomizedButton title="Search" type="warning" click={() => { }} />
          </Box>
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
            <Typography
              sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
            >
              Getting your bookings...
            </Typography>
          ) : bookingListData.length === 0 && searchFormInput.bookingStatus !== "All" ? (
            <Typography
              sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
            >
              No matching bookings.
            </Typography>
          ) : (
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
                    <StyledTableCell>Pick-up Time</StyledTableCell>
                    <StyledTableCell>From</StyledTableCell>
                    <StyledTableCell>To</StyledTableCell>
                    <StyledTableCell>Booking Status</StyledTableCell>
                    <StyledTableCell>Operation</StyledTableCell>
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
                        <StyledTableCell>
                          {row.trip.pickup_time
                            ? new Date(row.trip.pickup_time).toLocaleString()
                            : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {(row.trip.pickup_location as unknown as string).includes("{") // Temporary check to see if this is an old style booking.
                            ? // If it's a new booking style, use both the short name and the city name (last part of address - 5)
                            JSON.parse(
                              row.trip.pickup_location as unknown as string,
                            ).short_name.includes("Airport")
                              ? JSON.parse(row.trip.pickup_location as unknown as string).short_name
                              : JSON.parse(row.trip.pickup_location as unknown as string)
                                .short_name +
                              ", " +
                              JSON.parse(row.trip.pickup_location as unknown as string)
                                .address.split(",")
                                .slice(-5)[0]
                                .trim()
                            : row.trip.pickup_location}
                        </StyledTableCell>
                        <StyledTableCell>
                          {(row.trip.dropoff_location as unknown as string).includes("{") // Temporary check to see if this is an old style booking.
                            ? JSON.parse(
                              row.trip.dropoff_location as unknown as string,
                            ).short_name.includes("Airport")
                              ? JSON.parse(row.trip.dropoff_location as unknown as string).short_name
                              : JSON.parse(row.trip.dropoff_location as unknown as string)
                                .short_name +
                              ", " +
                              JSON.parse(row.trip.dropoff_location as unknown as string)
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
                          <div className="flex gap-2 justify-center">
                            <CustomizedButton
                              click={() => handleViewDialogOpen(row)}
                              type="warning"
                              title="View"
                            />
                            {row.booking_status === "Pending" && (
                              <CustomizedButton
                                click={() => handleEditTrigger(row)}
                                type="warning"
                                title="Edit"
                              />
                            )}
                            {row.booking_status === "Pending" && (
                              <CustomizedButton
                                click={() => handleCancelBooking(row)}
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
          )}
          <ViewDialog
            viewData={bookDetail!}
            dialogOpen={bookDetailDialogOpen}
            handleDialogClose={handleViewDialogClose}
          />
          <ConfirmDialog
            open={cancelBookDialogOpen}
            dialogTitle="Cancel Booking"
            confirmMessage="Are you sure you want to cancel this booking?"
            confirmCallBack={handleConfirmCancel}
            cancelCallBack={handleCancelDialogClose}
          />
          <div className="flex justify-center mt-4">
            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              count={bookingListCount}
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
        </motion.div>
      )}
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarState.open}
        onClose={handleCloseSnackbarState}
      >
        <Alert
          onClose={handleCloseSnackbarState}
          severity={snackbarState.status === "success" ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={notificationSnackbarState.open}
        onClose={handleCloseNotificationSnackbarState}
      >
        <Alert
          onClose={handleCloseNotificationSnackbarState}
          severity={notificationSnackbarState.status === "success" ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notificationSnackbarState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Page;

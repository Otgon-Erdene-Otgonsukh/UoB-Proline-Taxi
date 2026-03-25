"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { BookingRecord, UserRecord } from "@/model/models";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import SuperDashboard from "@/components/SuperDashboard";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  TablePagination,
  MenuItem,
  FormControl,
  TextField,
  Select,
  InputLabel,
  Button,
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import CancelIcon from '@mui/icons-material/Cancel';
import { DateTimePicker } from "@/components/datetimePicker/DateTimePicker";
import { enLocale } from "@/components/datetimePicker/locale";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  FirstPage
} from "@mui/icons-material"
import { getUsersAsAdmin, updateUserAsAdmin, cancelBooking, getBookingList } from "./request";
import ViewDialog from "./userManageComponents/viewDialog";
import EditDialog from "./userManageComponents/eidtDialog";
import { userStatusToIntMap, userStatusToStrMap, roleStrMap, roles, roleReadableStrMap } from "./constants";
import { getDepartmentsList } from "./requests";
import ConfirmDialog from "@/components/confirmDIalog";
import { UserTable } from "@/components/SuperUsersTable";
import CustomizedButton from "@/components/CustomizedButton";
import { bookingStatus } from "../home/constants";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import { StyledTableCell } from "@/components/StyledTableCell";
import BookingPage from "../book/page";
import { getBookingsList } from "./requests";
import { BookingTable } from "@/components/SuperBookingsTable";
import DepartmentManagePage from "./departmentManageComponents/departmentManagePage";
import { UserManagePage } from "./userManageComponents/userManagePage";


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
  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle>Booking Details</DialogTitle>
      <DialogContent>
        <p>Booking ID: {viewData.booking_id}</p>
        <p>Additinal Info: {viewData.additional_info}</p>
        <p>Time Created: {viewData.time_created}</p>
        <p>Pickup: {viewData.trip.pickup_location}</p>
        <p>Dropoff: {viewData.trip.dropoff_location}</p>
        <p>Pickup Time: {viewData.trip.pickup_time}</p>
        <p>Booking Status: {viewData.booking_status}</p>
      </DialogContent>
    </Dialog>
  );
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

const Page = () => {
  // Get NextAuth Session.
  const { status } = useSession();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [pendingUsersData, setPendingUsersData] = useState<UserRecord[]>([]);
  const [pendingUserCount, setPendingUserCount] = useState(0)
  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });

  const [departments, setDepartments] = useState<UserRecord["department"][]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    getDepartmentsList().then(async res => {
      if (res.status === 200) {
        const data = await res.json();
        setDepartments(data);
      }
    })
  }, [status, router,]);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPaginationMeta({
      ...paginationMeta,
      page: newPage
    })
    setIsLoading(true);
    _getBookingListData(newPage, paginationMeta.pageSize);
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaginationMeta({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
    setIsLoading(true)
  };

  const [userDetail, setUserDetail] = useState<UserRecord>()
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleViewDialogOpen = (row: UserRecord) => {
    console.log(row);
    setUserDetail(row)
    setViewDialogOpen(true);
  }

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleEditDialogOpen = (row: UserRecord) => {
    console.log(row);
    setUserDetail(row)
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = (isEdited: boolean) => {
    setEditDialogOpen(false);
    // after edit dialog closed, rerender table to get updated data
    if (isEdited) {
      setIsLoading(true)
      _getBookingListData(0, paginationMeta.pageSize)
    }
  }

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

  const _getBookingListData = (page: number, pageSize: number) => {
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
  };

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    status: "success",
    message: "",
  });

  const handleCloseSnackbarState = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
  };

  // Cancel booking
  const [cancelBookDialogOpen, setCancelBookDialogOpen] = useState(false);
  const [toCancelBookingId, setToCancelBookingId] = useState<number>();

  const handleBookingsCancelBooking = (row: BookingRecord) => {
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

  const handleBookingsSubmitSearchForm = (e: React.SubmitEvent<HTMLFormElement>) => {
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
    _getBookingListData(0, paginationMeta.pageSize);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const [tabValue, setTabValue] = useState(0);

  const [bookDetailDialogOpen, setBookDetailDialogOpen] = useState(false);
  const [bookDetail, setBookDetail] = useState<BookingRecord>();

  const handleBookingDialogOpen = () => {
    setEditBookDialogOpen(true);
  };

  const handleBookingsViewDialogOpen = (data: BookingRecord) => {
    setBookDetail(data);
    setBookDetailDialogOpen(true);
  };
  const handleBookingsViewDialogClose = () => {
    setBookDetailDialogOpen(false);
  };

  const [editBookDialogOpen, setEditBookDialogOpen] = useState(false);
  const handleBookingsEditDialogOpen = (data: BookingRecord) => {
    setBookDetail(data);
    setEditBookDialogOpen(true);
  };
  const handleBookingsEditDialogClose = () => {
    setEditBookDialogOpen(false);
  };

  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const dateTimePickerFromAnchorRef = useRef<HTMLDivElement>(null);
  const dateTimePickerToAnchorRef = useRef<HTMLDivElement>(null);
  const [dateTimePickerFromOpen, setDateTimePickerFromOpen] = useState(false);
  const [dateTimePickerToOpen, setDateTimePickerToOpen] = useState(false);

  const [bookingListData, setBookingListData] = useState<BookingRecord[]>([]);
  const [bookingListCount, setBookingListCount] = useState(0);

  return (
    <div className="flex-col font-inter">
      <header className="w-full bg-[#2c2c2c] text-white p-3 shadow-lg items-center flex gap-4 sticky top-0 z-50">
        <Button
          onClick={toggleDrawer(true)}
          sx={{ color: "white", minWidth: '40px' }}
        >
          <MenuIcon fontSize="medium" />
        </Button>
        <span className="font-aleo text-2xl sm:text-3xl font-semibold">User Management</span>
      </header>

      <div className="w-full flex justify-center items-start p-4">
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', fontFamily: "aleo", fontSize: 25 }}>
              Admin Menu
            </Typography>
            <Divider />
            <List>
              {[
                { text: 'Users', icon: <PeopleIcon />, index: 0 },
                { text: 'Departments', icon: <GroupsIcon />, index: 1 },
                { text: 'Bookings', icon: <LocalTaxiIcon />, index: 2 },
                { text: 'Dashboard', icon: <DashboardIcon />, index: 3},
                { text: 'Export Bookings', icon: <FileDownloadIcon />, index: 4 },
                { text: 'Admin Settings', icon: <SettingsIcon />, index: 5 },
              ].map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton onClick={() => setTabValue(item.index)}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      
      <div className="w-full">
        {tabValue === 0 && (
          <div>
            <UserManagePage departments={departments} />
          </div>
        )}

        {tabValue === 1 && (
          <div>
            <DepartmentManagePage />
          </div>
        )}
        {tabValue === 2 && (
          <>
              <div className="flex justify-between items-center mb-4 px-10">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-aleo md:text-3xl font-semibold text-shadow-lg/20 pr-20">
                    Bookings
                  </h1>
                </div>
                  
                <Box
                  component="form"
                  onSubmit={handleBookingsSubmitSearchForm}
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

                  <CustomizedButton
                    title="+"
                    type="warning"
                    click={handleBookingDialogOpen}
                  />
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
              </div>
              {isLoading ? (
                <Typography
                  sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
                >
                  Getting your bookings...
                </Typography>
              ) : bookingListData.length === 0 ? (
                <Typography
                  sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
                >
                  No bookings to show.
                </Typography>
              ) : (
                <BookingTable
                  data={bookingListData}
                  count={bookingListCount}
                  page={paginationMeta.page}
                  pageSize={paginationMeta.pageSize}
                  onPageChange={handleChangePage}
                  onPageSizeChange={handleChangePageSize}
                  ActionsComponent={TablePaginationActions}
                  onViewDetails={handleBookingsViewDialogOpen}
                  onEditBooking={handleBookingsEditDialogOpen}
                  onCancelBooking={handleBookingsCancelBooking}
                />
              )}
              {bookDetail && (
                <BookingViewDialog
                  viewData={bookDetail}
                  dialogOpen={bookDetailDialogOpen}
                  handleDialogClose={handleBookingsViewDialogClose}
                />
              )}
              <Dialog
                onClose={handleBookingsEditDialogClose}
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
                  onClick={handleBookingsEditDialogClose}
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
                    onClick={handleCancelDialogClose}
                  >
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
              <ConfirmDialog
                open={cancelBookDialogOpen}
                dialogTitle="Cancel Booking"
                confirmMessage="Are you sure you want to cancel this booking?"
                confirmCallBack={handleConfirmCancel}
                cancelCallBack={handleCancelDialogClose}
              />
            </>
          )}
          {tabValue === 3 && <SuperDashboard/>}
      
      {userDetail && (
        <ViewDialog 
          viewData={userDetail} 
          dialogOpen={viewDialogOpen} 
          handleDialogClose={() => setViewDialogOpen(false)} 
        />
      )}
      
      {userDetail && (
        <EditDialog 
          key={userDetail.user_id} 
          editData={userDetail} 
          dialogOpen={editDialogOpen} 
          handleDialogClose={handleEditDialogClose} 
          departmentList={departments} 
        />
      )}
      </div>
      </div>
      </div>
  );
};

export default Page;

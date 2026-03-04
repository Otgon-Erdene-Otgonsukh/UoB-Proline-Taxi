"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { UserRecord } from "@/model/models";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GroupsIcon from '@mui/icons-material/Groups';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  FirstPage
} from "@mui/icons-material"
import { getUsersAsAdmin, updateUserAsAdmin } from "./request";
import ViewDialog from "./userManageComponents/viewDialog";
import EditDialog from "./userManageComponents/eidtDialog";
import { userStatusToIntMap, userStatusToStrMap, roleStrMap, roles, roleReadableStrMap } from "./constants";
import { getDepartmentsList } from "./requests";
import ConfirmDialog from "@/components/confirmDIalog";
import { UserTable } from "@/components/SuperUsersTable";
import CustomizedButton from "@/components/CustomizedButton";
import { bookingStatus } from "../home/constants";

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

    _rerenderTable()

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
    _rerenderTable()
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaginationMeta({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
    setIsLoading(true)
    _rerenderTable()
  };

  // search form
  type SearchFormProps = {
    name?: string,
    user_status: number,
    role: string,
  }
  const [searchFormInput, setSearchFormInput] = useState<SearchFormProps>({
    name: '',
    user_status: userStatusToIntMap.pending,
    role: roleStrMap.normalUser
  })
  const handleSubmitSearchForm = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('submit');
    setIsLoading(true)
    _rerenderTable()
  }

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
      _rerenderTable()
    }
  }

  const [confirmAcceptDialogOpen, setConfirmAcceptDialogOpen] = useState(false);
  const handleAcceptUserRegister = (row: UserRecord) => {
    updateUserAsAdmin({
      ...row,
      user_status: userStatusToIntMap.approved
    }).then(res => {
      if (res.status === 200) {
        setIsLoading(true)
        _rerenderTable()
      }
    })
  };

  const [confirmRejectDialogOpen, setConfirmRejectDialogOpen] = useState(false);
  const handleRejectUserRegister = (row: UserRecord) => {
    updateUserAsAdmin({
      ...row,
      user_status: userStatusToIntMap.rejected
    }).then(res => {
      if (res.status === 200) {
        setIsLoading(true)
        _rerenderTable()
      }
    })
  };

  const _rerenderTable = () => {
    getUsersAsAdmin({
      name: undefined,
      ...searchFormInput,
      page: paginationMeta.page,
      pageSize: paginationMeta.pageSize
    }).then(res => {
      if (res.status === 200) {
        res.json().then(data => {
          setPendingUsersData(data.userList)
          setPendingUserCount(data.userCount)
          setIsLoading(false)
        })
      }
    })
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);


  };

  const [tabValue, setTabValue] = useState(0);

  const handleBookingDialogOpen = () => {
    setEditBookDialogOpen(true);
  };

  type BookingSearchFormProps = {
      pickUpTimeFrom?: Date;
      pickUpTimeTo?: Date;
      from?: string;
      to?: string;
      bookingStatus?: string;
    };
    
    const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

    const dateTimePickerFromAnchorRef = useRef<HTMLDivElement>(null);
    const dateTimePickerToAnchorRef = useRef<HTMLDivElement>(null);
    const [dateTimePickerFromOpen, setDateTimePickerFromOpen] = useState(false);
    const [dateTimePickerToOpen, setDateTimePickerToOpen] = useState(false);

    const [bookingSearchFormInput, setBookingSearchFormInput] = useState<BookingSearchFormProps>({
      pickUpTimeFrom: undefined,
      pickUpTimeTo: undefined,
      from: undefined,
      to: undefined,
      bookingStatus: undefined
    })
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
              { text: 'Export Bookings', icon: <FileDownloadIcon />, index: 3 },
              { text: 'Admin Settings', icon: <SettingsIcon />, index: 4 },
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
          <>
            <div className="flex justify-between items-center mb-4 px-20">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-aleo md:text-3xl font-semibold text-shadow-lg/20">
                  Users Table
                </h1>
              </div>
              <Box
                component="form"
                onSubmit={handleSubmitSearchForm}
                sx={{
                  display: "flex",
                  gap: 2.5,
                }}
              >
                <TextField
                  fullWidth
                  label="Name"
                  id="searchNameInput"
                  value={searchFormInput.name}
                  onChange={(e) => { setSearchFormInput({ ...searchFormInput, name: e.target.value }); }}
                  size="small"
                  sx={{ minWidth: 150 }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="searchUserStatusInput">Account Type</InputLabel>
                  <Select
                    label="Account Type"
                    id="searchUserStatusInput"
                    value={searchFormInput.role}
                    onChange={(e) => { setSearchFormInput({ ...searchFormInput, role: e.target.value }); }}
                    size="small"
                  >
                    {roles.map(e => {
                      return <MenuItem value={e} key={e}>{roleReadableStrMap[e]}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="searchUserStatusInput">User Status</InputLabel>
                  <Select
                    label="UserStatus"
                    id="searchUserStatusInput"
                    value={searchFormInput.user_status}
                    onChange={(e) => { setSearchFormInput({ ...searchFormInput, user_status: e.target.value }); }}
                    size="small"
                  >
                    <MenuItem value={userStatusToIntMap.pending}>{userStatusToStrMap[userStatusToIntMap.pending]}</MenuItem>
                    <MenuItem value={userStatusToIntMap.approved}>{userStatusToStrMap[userStatusToIntMap.approved]}</MenuItem>
                    <MenuItem value={userStatusToIntMap.rejected}>{userStatusToStrMap[userStatusToIntMap.rejected]}</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#2c2c2c",
                    color: "white",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    "&:hover": {
                      bgcolor: "#414040",
                      transform: "scale(1.01)",
                    },
                    transition: "all 0.2s",
                  }}
                  size="small"
                >
                  Search
                </Button>
              </Box>
            </div>
            <div className="w-full">
            {isLoading ? (
              <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}>
                Getting user data...
              </Typography>
            ) : pendingUsersData.length === 0 ? (
              <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}>
                No users to show.
              </Typography>
            ) : (
                <UserTable
                  data={pendingUsersData}
                  count={pendingUserCount}
                  page={paginationMeta.page}
                  pageSize={paginationMeta.pageSize}
                  onPageChange={handleChangePage}
                  onPageSizeChange={handleChangePageSize}
                  onViewDetails={handleViewDialogOpen}
                  onEditUser={handleEditDialogOpen}
                  onAcceptUser={(u) => { setUserDetail(u); setConfirmAcceptDialogOpen(true); }}
                  onRejectUser={(u) => { setUserDetail(u); setConfirmRejectDialogOpen(true); }}
                  ActionsComponent={TablePaginationActions}
                />
            )}
            </div>
          </>
        )}

        {tabValue === 1 && (
            <div>
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
                    click={handleBookingDialogOpen}
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
                    value={bookingSearchFormInput.from}
                    onChange={(e) => {
                      setBookingSearchFormInput({
                        ...bookingSearchFormInput,
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
                    value={bookingSearchFormInput.to}
                    onChange={(e) => {
                      setBookingSearchFormInput({ ...bookingSearchFormInput, to: e.target.value });
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
                      value={bookingSearchFormInput.bookingStatus}
                      onChange={(e) => {
                        setBookingSearchFormInput({
                          ...bookingSearchFormInput,
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
                    fullWidth
                    onClick={() => setDateTimePickerFromOpen(true)}
                    label="Pick Up Date From"
                    size="small"
                    sx={{ minWidth: 150 }}
                    ref={dateTimePickerFromAnchorRef}
                    defaultValue={bookingSearchFormInput.pickUpTimeFrom?.toDateString()}
                    slotProps={{
                      inputLabel: {
                        shrink: bookingSearchFormInput.pickUpTimeFrom !== undefined,
                      },
                    }}
                  />
                  {bookingSearchFormInput.pickUpTimeFrom && (
                    <IconButton
                      size="small"
                      sx={{ px: 1.3, mx: -2 }}
                      onClick={() => {
                        setBookingSearchFormInput({
                          ...bookingSearchFormInput,
                          pickUpTimeFrom: undefined,
                        });
                        setIsSearchSubmitted(false);
                      }}
                    >
                      <CancelIcon fontSize="small" sx={{ color: "red" }} />
                    </IconButton>
                  )}
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
                ) : bookingListData.length === 0 ? (
                  <Typography
                    sx={{ color: "gray", fontSize: 16, textAlign: "center", my: 10 }}
                  >
                    No bookings to show.
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
                                {row.trip.airport === "" || row.trip.airport === null
                                  ? row.trip.pickup_location
                                  : row.trip.airport}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.trip.dropoff_location}
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
                                      click={() => handleEditDialogOpen(row)}
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
          </div>
        )}
      </div>  
      
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

      <ConfirmDialog
        open={confirmAcceptDialogOpen}
        dialogTitle="Accept User Registration"
        confirmMessage="Are you sure you want to accept this user registration?"
        confirmCallBack={() => { handleAcceptUserRegister(userDetail!); setConfirmAcceptDialogOpen(false); }}
        cancelCallBack={() => setConfirmAcceptDialogOpen(false)}
      />

      <ConfirmDialog
        open={confirmRejectDialogOpen}
        dialogTitle="Reject User Registration"
        confirmMessage="Are you sure you want to reject this user registration?"
        confirmCallBack={() => { handleRejectUserRegister(userDetail!); setConfirmRejectDialogOpen(false); }}
        cancelCallBack={() => setConfirmRejectDialogOpen(false)}
      />
    </div>
    </div>
  );
};

export default Page;

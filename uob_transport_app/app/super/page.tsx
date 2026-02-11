"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserRecord } from "@/model/models";
import { useTheme } from "@mui/material/styles";
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
  Alert,
  Snackbar,
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
import sendRes from "@/backend/register/send_res";
import { getUsersAsAdmin, updateUserAsAdmin } from "./request";
import ViewDialog from "./userManageComponents/viewDialog";
import EditDialog from "./userManageComponents/eidtDialog";
import { userStatusToIntMap, userStatusToStrMap, roleStrMap, roles, roleReadableStrMap } from "./constants";
import { getDepartmentsList } from "./requests";
import ConfirmDialog from "@/components/confirmDIalog";
import { UserTable } from "@/components/SuperUsersTable";
import page from "../page";

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
  const { status, data } = useSession();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [pendingUsersData, setPendingUsersData] = useState<UserRecord[]>([]);
  const [pendingUserCount, setPendingUserCount] = useState(0);
  const [snackOpen, setSnackOpen] = useState(false);
  const [severity, setSeverity] = useState<"success" | "error">("success")
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

    // Protect this route from logged in not admin users
    if (status === "authenticated" && data.user.account_type !== "super_admin" && data.user.account_type !== "proline_staff") {
      router.push("/home");
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
    _getData(newPage, paginationMeta.pageSize)
  };

  const handleChangePageSize = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaginationMeta({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
    setIsLoading(true)
    _getData(0, parseInt(event.target.value, 10))
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
    setIsLoading(true)
    setPaginationMeta({
      page: 0,
      pageSize: paginationMeta.pageSize,
    })
    _getData(0, paginationMeta.pageSize)
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
        setSnackOpen(true)
        setSeverity("success")         
      } else {
        setSnackOpen(true)
        setSeverity("error")
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
        setSnackOpen(true)
        setSeverity("success")        
      } else {
        setSnackOpen(true)
        setSeverity("error")
      }
    })
  };

  const _getData = (page: number, pageSize: number) => {
    getUsersAsAdmin({
      name: undefined,
      ...searchFormInput,
      page,
      pageSize
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }



  return (
    <div className="flex-col font-inter">
      <header className="w-full bg-[#2c2c2c] text-white p-2 shadow-lg items-center flex gap-4">
        <Button
          onClick={toggleDrawer(true)}
          sx={{ color: "white", minWidth: '40px' }}
        >
          <MenuIcon fontSize="medium" />
        </Button>
        <span className="font-aleo text-2xl sm:text-3xl font-semibold">Management Panel</span>
      </header>
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
          <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
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
      <div className="w-full p-4">

        {tabValue === 0 && (
          <>
            <div className="flex justify-center items-center mb-4">

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
                    label="UserStatus"
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

            {isLoading ? (
              <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center" }}>
                Getting user data...
              </Typography>
            ) : pendingUsersData.length === 0 ? (
              <Typography sx={{ color: "gray", fontSize: 16, textAlign: "center" }}>
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
          </>
        )}

        {tabValue === 1 && (
          <div>Departments Table View (to be implemented)</div>
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
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => {setSnackOpen(false)}} anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Alert onClose={() => {setSnackOpen(false)}} severity={severity} variant="filled">{severity === "success" ? "Account registration response email sent!" : "There was an error sending response mail"}</Alert>
      </Snackbar>
    </div>
  );
};

export default Page;

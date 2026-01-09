"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StyledTableCell } from "@/components/StyledTableCell";
import { UserRecord } from "@/model/models";
import CustomizedButton from "@/components/CustomizedButton";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  TablePagination,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  FirstPage
} from "@mui/icons-material"
import { getUsersAsAdmin } from "./request";
import ViewDialog from "./userManageComponents/viewDialog";
import EditDialog from "./userManageComponents/eidtDialog";
import { userStatusToIntMap, userStatusToStrMap, roleStrMap, roles } from "./constants";
import { getDepartmentsList } from "./requests";

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

  const handleAcceptUserRegister = (row: UserRecord) => {
    console.log(row);
  };

  const handleRejectUserRegister = (row: UserRecord) => {
    console.log(row);
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

  return (
    <div className="flex justify-center font-inter p-4">
      <div className="bg-white shadow-lg/20 rounded-lg p-6 md:p-8 w-full max-w-6xl my-15 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-aleo text-2xl sm:text-3xl font-semibold text-shadow-lg/20">
            User Management
          </h1>
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
              <InputLabel id="searchUserStatusInput">Role</InputLabel>
              <Select
                label="UserStatus"
                id="searchUserStatusInput"
                value={searchFormInput.role}
                onChange={(e) => { setSearchFormInput({ ...searchFormInput, role: e.target.value }); }}
                size="small"
              >
                {roles.map(e => {
                  return <MenuItem value={e} key={e}>{e}</MenuItem>
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
                <MenuItem value={userStatusToIntMap.normal}>{userStatusToStrMap[userStatusToIntMap.normal]}</MenuItem>
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
                  <StyledTableCell>Time Created</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>email</StyledTableCell>
                  <StyledTableCell>Phone Number</StyledTableCell>
                  <StyledTableCell>Department</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>User Status</StyledTableCell>
                  <StyledTableCell>Operation</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingUsersData &&
                  pendingUsersData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { bgcolor: "#f9fafb" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <StyledTableCell>{row.time_created}</StyledTableCell>
                      <StyledTableCell>{row.name + ' ' + row.surname}</StyledTableCell>
                      <StyledTableCell>{row.email}</StyledTableCell>
                      <StyledTableCell>{row.phone_number}</StyledTableCell>
                      <StyledTableCell>{row.department.dep_name}</StyledTableCell>
                      <StyledTableCell>{row.role}</StyledTableCell>
                      <StyledTableCell>
                        <span
                          className={`inline-block px-5 py-1 rounded-full text-xs font-medium ${row.user_status === userStatusToIntMap.normal
                            ? "bg-green-100 text-green-800 border border-green-800"
                            : row.user_status === userStatusToIntMap.rejected
                              ? "bg-red-100 text-red-800 border border-red-800"
                              : row.user_status === userStatusToIntMap.pending
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-800"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-800"
                            }`}
                        >
                          {userStatusToStrMap[row.user_status]}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className="flex gap-2 justify-center">
                          <CustomizedButton
                            click={() => handleViewDialogOpen(row)}
                            type="primary"
                            title="View"
                          />
                          {/* super admin can edit user under any circumstances */}
                          <CustomizedButton
                            click={() => handleEditDialogOpen(row)}
                            type="warning"
                            title="Edit"
                          />
                          {row.user_status === userStatusToIntMap.pending && (
                            <CustomizedButton
                              click={() => handleAcceptUserRegister(row)}
                              type="primary"
                              title="Accept"
                            />
                          )}
                          {row.user_status === userStatusToIntMap.pending && (
                            <CustomizedButton
                              click={() => handleRejectUserRegister(row)}
                              type="error"
                              title="Reject"
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
        <div className="flex justify-center mt-4">
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            count={pendingUserCount}
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
      {userDetail && <ViewDialog viewData={userDetail} dialogOpen={viewDialogOpen} handleDialogClose={() => { setViewDialogOpen(false); }} />}
      {userDetail && <EditDialog key={userDetail.user_id} editData={userDetail} dialogOpen={editDialogOpen} handleDialogClose={handleEditDialogClose} departmentList={departments} />}
    </div>
  );
};

export default Page;

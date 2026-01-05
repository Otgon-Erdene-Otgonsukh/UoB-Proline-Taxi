"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TableHead } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { StyledTableCell } from "@/components/StyledTableCell";
import { UserRecord } from "@/model/models";
import CustomizedButton from "@/components/CustomizedButton";

const userStatusToIntMap = {
  pending: 0,
  normal: 1,
  rejected: 2
}
const userStatusToStrMap = ['pending', 'normal', 'rejected']

const Page = () => {
  // Get NextAuth Session.
  const { status } = useSession();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    // if (status === "unauthenticated") {
    //   router.push("/login");
    //   return;
    // }

    // getUserBookingList(paginationMeta.page, paginationMeta.pageSize).then(
    //   (res) => {
    //     if (res.status === 200) {
    //       res.json().then((data) => {
    //         setBookingListData(data.bookings);
    //         setBookingListCount(data.totalNum);
    //         setIsLoading(false);
    //       });
    //     }
    //   }
    // );
    setIsLoading(false);
    setPendingUsersData([{
      time_created: '2024',
      user_id: '1',
      name: 'abc',
      surname: 'edf',
      email: '',
      department: {
        name: 'Mathematics'
      },
      phone_number: '',
      role: 'admin',
      user_status: 0
    }])
  }, [status, paginationMeta.page, paginationMeta.pageSize, router]);

  const handleClick = () => {
    router.push("/book");
  };

  const [pendingUsersData, setPendingUsersData] = useState<UserRecord[]>([]);

  const handleViewDialogOpen = (row: UserRecord) => {
    console.log(row);
  }

  const handleEditDialogOpen = (row: UserRecord) => {
    console.log(row);
  };

  const handleRejectUserRegister = (row: UserRecord) => {
    console.log(row);
  };

  return (
    <div className="flex justify-center font-inter p-4">
      <div className="bg-white shadow-lg/20 rounded-lg p-6 md:p-8 w-full max-w-6xl my-15 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-aleo text-2xl sm:text-3xl font-semibold text-shadow-lg/20">
            Pending Users
          </h1>
          <button
            onClick={handleClick}
            className="bg-[#2c2c2c] text-white py-2 px-6 rounded-md hover:bg-[#474747] hover:scale-101 transition-all duration-200 text-sm font-light cursor-pointer"
          >
            + New User
          </button>
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
                      <StyledTableCell>{row.department.name}</StyledTableCell>
                      <StyledTableCell>{row.role}</StyledTableCell>
                      <StyledTableCell>
                        <span
                          className={`inline-block px-5 py-1 rounded-full text-xs font-medium ${row.user_status === userStatusToIntMap.normal
                            ? "bg-green-100 text-green-800 border border-green-800"
                            : row.user_status === userStatusToIntMap.rejected
                              ? "bg-red-100 text-red-800 border border-red-800"
                              : row.user_status === userStatusToIntMap.pending
                                ? "bg-gray-300 text-gray-900 border border-gray-900"
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
      </div>
    </div>
  );
};

export default Page;

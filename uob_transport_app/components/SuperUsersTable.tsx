import {
    Table, TableBody, TableHead, TableRow, TableContainer, Paper,
    Box,
    TablePagination
} from "@mui/material";
import { StyledTableCell } from "@/components/StyledTableCell";
import CustomizedButton from "@/components/CustomizedButton";
import { UserRecord } from "@/model/models";
import { userStatusToIntMap, userStatusToStrMap, roleReadableStrMap } from "@/app/super/constants";
import { TablePaginationProps } from "@mui/material";

interface UserTableViewProps {
    data: UserRecord[];
    count: number;
    page: number;
    pageSize: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onPageSizeChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    ActionsComponent: TablePaginationProps['ActionsComponent']
    onViewDetails: (user: UserRecord) => void;
    onEditUser: (user: UserRecord) => void;
    onAcceptUser: (user: UserRecord) => void;
    onRejectUser: (user: UserRecord) => void;
}

export const UserTable = ({ data, count, page, pageSize, onPageChange, onPageSizeChange, ActionsComponent, onViewDetails, onEditUser, onAcceptUser, onRejectUser }: UserTableViewProps) => {
    return (
        <Box>
            <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "none" }}
            >
                <Table
                    size="small"
                    sx={{ minWidth: 500, borderCollapse: "collapse" }}
                    aria-label="user table"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ p: 0 }}>Time Created</StyledTableCell>
                            <StyledTableCell sx={{ p: 0 }}>Name</StyledTableCell>
                            <StyledTableCell sx={{ p: 0 }}>Email</StyledTableCell>
                            <StyledTableCell sx={{ p: 0 }}>Phone Number</StyledTableCell>
                            <StyledTableCell sx={{ p: 0 }}>Department</StyledTableCell>
                            <StyledTableCell sx={{ p: 0 }}>Account Type</StyledTableCell>
                            <StyledTableCell sx={{ p: 0 }}>User Status</StyledTableCell>
                            <StyledTableCell sx={{ p: 0 }}>Operation</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data &&
                            data.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:hover": { bgcolor: "#ebebeb" },
                                        '& td': { p: 0 },
                                    }}
                                >
                                    <StyledTableCell>{new Date(row.time_created).toDateString()}</StyledTableCell>
                                    <StyledTableCell>{row.name + ' ' + row.surname}</StyledTableCell>
                                    <StyledTableCell>{row.email}</StyledTableCell>
                                    <StyledTableCell>{row.phone_number}</StyledTableCell>
                                    <StyledTableCell>{row.department.dep_name}</StyledTableCell>
                                    <StyledTableCell>{roleReadableStrMap[row.role]}</StyledTableCell>
                                    <StyledTableCell>
                                        <span
                                            className={`inline-block px-5 py-1 rounded-full text-xs font-medium ${row.user_status === userStatusToIntMap.approved
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
                                                click={() => onViewDetails(row)}
                                                type="primary"
                                                title="View"
                                            />
                                            {/* super admin can edit user under any circumstances */}
                                            <CustomizedButton
                                                click={() => onEditUser(row)}
                                                type="warning"
                                                title="Edit"
                                            />
                                            {/* Accept and Reject button occurs only when user is pending */}
                                            {row.user_status === userStatusToIntMap.pending && (
                                                <CustomizedButton
                                                    click={() => { onAcceptUser(row); }}
                                                    type="primary"
                                                    title="Accept"
                                                />
                                            )}
                                            {/* Accept and Reject button occurs only when user is pending */}
                                            {row.user_status === userStatusToIntMap.pending && (
                                                <CustomizedButton
                                                    click={() => { onRejectUser(row); }}
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <TablePagination
                    component="div"
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    count={count}
                    rowsPerPage={pageSize}
                    page={page}
                    slotProps={{
                        select: {
                            inputProps: {
                                "aria-label": "rows per page",
                            },
                            native: true,
                        },
                    }}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onPageSizeChange}
                    ActionsComponent={ActionsComponent}
                />
            </Box>
        </Box>

    );
};
import {
    Table, TableBody, TableHead, TableRow, TableContainer, Paper,
    Box,
    TablePagination,
    Button,
    Chip
} from "@mui/material";
import { StyledTableCell } from "@/components/StyledTableCell";
import CustomizedButton from "@/components/CustomizedButton";
import { DepartmentRecord } from "@/model/models";
import { TablePaginationProps } from "@mui/material";

interface DepartmentTableViewProps {
    data: DepartmentRecord[];
    count: number;
    page: number;
    pageSize: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onPageSizeChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    ActionsComponent: TablePaginationProps['ActionsComponent']
    onViewDetails: (department: DepartmentRecord) => void;
    onViewManager: (manager: DepartmentRecord["manager"]) => void;
    onDeleteDepartment: (department: DepartmentRecord) => void;
    onAssignManager: (department: DepartmentRecord) => void;
}

export const DepartmentTable = ({ data, count, page, pageSize, onPageChange, onPageSizeChange, ActionsComponent, onViewDetails, onViewManager, onDeleteDepartment, onAssignManager }: DepartmentTableViewProps) => {
    return (
        <Box>
            <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "none" }}
            >
                <Table
                    sx={{ minWidth: 500, borderCollapse: "collapse" }}
                    aria-label="department table"
                    size="small"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Managers</StyledTableCell>
                            <StyledTableCell>User Count</StyledTableCell>
                            <StyledTableCell>Operation</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data &&
                            data.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:hover": { bgcolor: "#f9fafb" },
                                        transition: "background-color 0.3s",
                                    }}
                                >
                                    <StyledTableCell>{row.depName}</StyledTableCell>
                                    <StyledTableCell>
                                        <div className="flex gap-2 justify-center">
                                        {row.manager ?
                                            (<CustomizedButton
                                                click={() => onViewManager(row.manager!)}
                                                type="warning"
                                                title="View"
                                            />
                                            ) :
                                            (<CustomizedButton
                                                click={() => onAssignManager(row)}
                                                type="primary"
                                                title="Assign"
                                            />
                                            )
                                        }
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell>{row.userCount}</StyledTableCell>
                                    <StyledTableCell>
                                        <div className="flex gap-2 justify-center">
                                            <CustomizedButton
                                                click={() => onViewDetails(row)}
                                                type="warning"
                                                title="View"
                                            />
                                            <CustomizedButton
                                                click={() => onDeleteDepartment(row)}
                                                type="error"
                                                title="Delete"
                                            />
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

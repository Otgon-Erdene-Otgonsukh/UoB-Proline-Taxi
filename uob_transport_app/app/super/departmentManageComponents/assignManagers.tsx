import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Box,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    Checkbox,
} from "@mui/material";
import {
    Close as CloseIcon,
} from "@mui/icons-material"
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { DepartmentRecord } from "@/model/models";
import { roleReadableStrMap } from "../constants";
import { useEffect, useState } from "react";
import { getUsersByDepId } from "../request";
import { StyledStickyTableCell } from "@/components/StyledTableCell";

const AssignManagerDialog = ({ viewData, dialogOpen, handleDialogClose, normalClose, assignSnackOpen }: { viewData: DepartmentRecord, dialogOpen: boolean, handleDialogClose: () => void, normalClose: () => void, assignSnackOpen: () => void }) => {

    const [members, setMembers] = useState<{ user_id: number, full_name: string, email: string, phone_number: string, role: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        if (!viewData?.depId) return;

        setIsLoading(true);
        getUsersByDepId(viewData.depId).then(async (res) => {
            if (res.status === 200) {
                const data = await res.json()
                console.log(data);
                setMembers(data)
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }, [viewData])

    const handleClickRow = (userId: number) => {
        const newSelected = selected === userId ? null : userId;
        setSelected(newSelected);
    };
 
    const handleAssignManager = async () => {
        if (selected === null) {
            alert("Please select a finance staff member to assign as manager.");
            return;
        }

        const memberToAssign = members.find(m => m.user_id === selected);

        if (!memberToAssign) {
            alert("Please select a finance staff member to assign as manager.");
            return;
        }

        fetch("api/manager_assignment", {
            method: "POST",
            body: JSON.stringify({
                user_id: memberToAssign.user_id,
                isAssign: true
            })
        }).then(res => {
            if (res.ok) {
                handleDialogClose();
                assignSnackOpen();
            }
        })
    };

    return (<div>
        <Dialog
            onClose={normalClose}
            aria-labelledby="customized-dialog-title"
            open={dialogOpen}
            maxWidth="md"
            fullWidth={true}
            sx={{
                "& .MuiStack-root": {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "400px",
                }
            }}
        >
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    fontFamily: "aleo",
                    fontWeight: "bold",
                    bgcolor: "#2c2c2c",
                    color: "white",
                    textAlign: "center",
                    fontSize: 28,
                }}
                id="customized-dialog-title"
            >
                Assign Managers
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={normalClose}
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
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <Typography gutterBottom sx={{ fontWeight: "bold", fontSize: 20 }}>
                        Department Name:
                    </Typography>
                    <Typography gutterBottom sx={{ fontSize: 20 }}>
                        {viewData?.depName}
                    </Typography>
                </div>
                <Typography gutterBottom sx={{ fontWeight: "bold", fontSize: 18, mt: 2 }}>
                    Finance Staff (Total {members.filter(m => m.role === 'finance_staff').length}):
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                    {isLoading ? <Typography sx={{ textAlign: "center", color: "gray" }}>Loading members...</Typography> : members.filter(m => m.role === 'finance_staff').length === 0 ? <Typography sx={{ textAlign: "center", color: "gray" }}><PersonOffIcon sx={{ mb: 0.5 }} /> No finance staff to show.</Typography> :
                        (<TableContainer component={Paper} sx={{ boxShadow: "none", border: "none", maxHeight: 600 }}>
                            <Table stickyHeader sx={{ minWidth: 500 }} aria-label="department members table" size="small">
                                <TableHead>
                                    <TableRow>
                                        <StyledStickyTableCell padding="checkbox">
                                            Select
                                        </StyledStickyTableCell>
                                        <StyledStickyTableCell>Name</StyledStickyTableCell>
                                        <StyledStickyTableCell>Email</StyledStickyTableCell>
                                        <StyledStickyTableCell>Phone number</StyledStickyTableCell>
                                        <StyledStickyTableCell>Role</StyledStickyTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {members.filter(m => m.role === 'finance_staff').map((member) => {
                                        const isItemSelected = selected === member.user_id;
                                        return (
                                            <TableRow
                                                hover
                                                onClick={() => handleClickRow(member.user_id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={member.user_id}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <StyledStickyTableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                handleClickRow(member.user_id);
                                                            } else {
                                                                setSelected(null);
                                                            }
                                                        }}
                                                    />
                                                </StyledStickyTableCell>
                                                <StyledStickyTableCell>{member.full_name}</StyledStickyTableCell>
                                                <StyledStickyTableCell>{member.email}</StyledStickyTableCell>
                                                <StyledStickyTableCell>{member.phone_number}</StyledStickyTableCell>
                                                <StyledStickyTableCell>{roleReadableStrMap[member.role]}</StyledStickyTableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>)
                    }
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                                onClick={handleAssignManager}
                                >
                            Assign as Manager
                        </Button>
                </Box>

                <Button
                    sx={{
                        color: "#2c2c2c",
                        transition: "all 250ms",
                        ":hover": { bgcolor: "#2c2c2c", color: "white" },
                    }}
                    onClick={normalClose}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </div>)
}

export default AssignManagerDialog;
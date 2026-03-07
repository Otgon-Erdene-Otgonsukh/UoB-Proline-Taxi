import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
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
} from "@mui/material";
import {
  EditOutlined as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { DepartmentRecord } from "@/model/models";
import { useEffect, useState } from "react";
import { getUsersByDepId } from "../request";
import { StyledStickyTableCell } from "@/components/StyledTableCell";
import SingleInputDialog from "@/components/singleInputDialog";

const ViewDepartmentDialog = ({ viewData, dialogOpen, handleDialogClose }: { viewData: DepartmentRecord, dialogOpen: boolean, handleDialogClose: () => void }) => {

  // TODO get all members of this department

  const [members, setMembers] = useState<{ user_id: number, full_name: string, email: string, phone_number: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
  }, [])

  const [nameEditOn, setNameEditOn] = useState(false);

  const handleSaveDepartmentName = (newName: string) => {
    // TODO call api to save new department name
    console.log("Saving new department name:", newName);
    setNameEditOn(false);
  }

  return (<div>
    <Dialog
      onClose={handleDialogClose}
      aria-labelledby="customized-dialog-title"
      open={dialogOpen}
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
        Department Detail
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleDialogClose}
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
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Department Name:
          </Typography>
          <Typography gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span>{viewData?.depName}</span>
            <EditIcon sx={{ cursor: "pointer" }} onClick={() => {
              setNameEditOn(true);
            }} fontSize="small" />
          </Typography>
        </Stack>
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Members (Total {viewData?.userCount}):
          </Typography>
        </Stack>
        <Box>
          {isLoading ? <Typography>Loading members...</Typography> :
            (<TableContainer component={Paper} sx={{ boxShadow: "none", border: "none", maxHeight: 600 }}>
              <Table stickyHeader sx={{ minWidth: 500 }} aria-label="department table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledStickyTableCell>Name</StyledStickyTableCell>
                    <StyledStickyTableCell>email</StyledStickyTableCell>
                    <StyledStickyTableCell>phone number</StyledStickyTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.user_id}>
                      <StyledStickyTableCell>{member.full_name}</StyledStickyTableCell>
                      <StyledStickyTableCell>
                        {member.email}
                      </StyledStickyTableCell>
                      <StyledStickyTableCell>{member.phone_number}</StyledStickyTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>)}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            color: "#2c2c2c",
            mr: 1,
            transition: "all 250ms",
            ":hover": { bgcolor: "#2c2c2c", color: "white" },
          }}
          onClick={handleDialogClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
    <SingleInputDialog
      open={nameEditOn}
      dialogTitle="Edit Department Name"
      dialogMessage="Please input the new department name:"
      inputLabel="Department Name"
      inputValue={viewData.depName}
      confirmButtonText="Save"
      cancelButtonText="Cancel"
      confirmCallBack={(input) => {
        handleSaveDepartmentName(input);
      }}
      cancelCallBack={() => setNameEditOn(false)}
    />
  </div>)
}

export default ViewDepartmentDialog;

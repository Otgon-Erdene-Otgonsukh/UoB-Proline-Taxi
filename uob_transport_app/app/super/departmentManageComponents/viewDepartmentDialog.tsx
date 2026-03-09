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
  Snackbar,
  Alert,
  Checkbox,
  Toolbar,
  Tooltip
} from "@mui/material";
import {
  EditOutlined as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material"
import { DepartmentRecord } from "@/model/models";
import { useEffect, useState } from "react";
import { getUsersByDepId, updateDepartmentName } from "../request";
import { StyledStickyTableCell } from "@/components/StyledTableCell";
import SingleInputDialog from "@/components/singleInputDialog";
import { alpha } from '@mui/material/styles';
import CustomizedButton from "@/components/CustomizedButton";

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
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    status: 'error',
    message: ''
  })

  const handleSaveDepartmentName = (newName: string) => {
    // TODO call api to save new department name
    console.log("Saving new department name:", newName);
    updateDepartmentName(viewData.depId, newName).then(async (res) => {
      if (res.status === 200) {
        const data = await res.json()
        setSnackbarState({
          open: true,
          status: 'success',
          message: 'Department name updated successfully!'
        });
      } else {
        const data = await res.json()
        console.log(data);
        setSnackbarState({
          open: true,
          status: 'error',
          message: data.message
        });
      }
    }).catch((err) => {
      console.error("Error updating department name:", err);
      setSnackbarState({
        open: true,
        status: 'error',
        message: 'An error occurred while updating the department name.'
      });
    }).finally(() => {
      setNameEditOn(false);
    });
  }

  // table enable selection
  const [selected, setSelected] = useState<readonly number[]>([]);
  const handleSelectAllRowsClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = members.map((member) => member.user_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClickRow = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  function EnhancedTableToolbar(props: {
    numSelected: number;
  }) {
    const { numSelected } = props;
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {numSelected > 0 ? (
          <Typography
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Selected {numSelected} out of {viewData?.userCount}:
          </Typography>
        ) : (
          <Typography
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Members (Total {viewData?.userCount}):
          </Typography>
        )}
        {numSelected > 0 && (
          <CustomizedButton
            title="change department"
            type="primary"
            click={() => { }}
          />
        )}
      </div>
    );
  }

  return (<div>
    <Dialog
      onClose={handleDialogClose}
      aria-labelledby="customized-dialog-title"
      open={dialogOpen}
      maxWidth="md"
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
          <EnhancedTableToolbar numSelected={selected.length} />
        </Stack>
        <Box sx={{ marginTop: 1 }}>
          {isLoading ? <Typography>Loading members...</Typography> :
            (<TableContainer component={Paper} sx={{ boxShadow: "none", border: "none", maxHeight: 600 }}>
              <Table stickyHeader sx={{ minWidth: 500 }} aria-label="department table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledStickyTableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={selected.length > 0 && selected.length < members.length}
                        checked={members.length > 0 && selected.length === members.length}
                        onChange={handleSelectAllRowsClick}
                        inputProps={{
                          'aria-label': 'select all desserts',
                        }}
                      />
                    </StyledStickyTableCell>
                    <StyledStickyTableCell>Name</StyledStickyTableCell>
                    <StyledStickyTableCell>email</StyledStickyTableCell>
                    <StyledStickyTableCell>phone number</StyledStickyTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member, index) => {
                    const isItemSelected = selected.includes(member.user_id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClickRow(event, member.user_id)}
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
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </StyledStickyTableCell>
                        <StyledStickyTableCell>{member.full_name}</StyledStickyTableCell>
                        <StyledStickyTableCell>
                          {member.email}
                        </StyledStickyTableCell>
                        <StyledStickyTableCell>{member.phone_number}</StyledStickyTableCell>
                      </TableRow>
                    )
                  })}
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
    <Snackbar
      autoHideDuration={2000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={snackbarState.open}
      onClose={() => setSnackbarState({ open: false, status: 'error', message: '' })}
    >
      <Alert
        onClose={() => setSnackbarState({ open: false, status: 'error', message: '' })}
        severity={snackbarState.status === 'success' ? 'success' : 'error'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbarState.message}
      </Alert>
    </Snackbar>
  </div>)
}

export default ViewDepartmentDialog;

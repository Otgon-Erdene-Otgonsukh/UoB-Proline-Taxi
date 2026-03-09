import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material"
import { useState } from "react";

interface MemberRow { user_id: number, full_name: string, email: string, phone_number: string }

export const ChangeDepartmentDialog = ({ departmentList, dialogOpen, handleDialogClose, selectedRows }: { departmentList: { depId: number, depName: string }[], dialogOpen: boolean, handleDialogClose: () => void, selectedRows: MemberRow[] }) => {

  const [chosenDepId, setChosenDepId] = useState<number | null>(null);
  const [departmentEmpty, setDepartmentEmpty] = useState(false);

  const handleConfirmChangeDepartment = () => {
    // TODO call api to change department for selected members
    console.log("Changing department for members:");
    handleDialogClose();
  }

  return (<Dialog
    open={dialogOpen}
    onClose={handleDialogClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {`Change department for ${selectedRows.length} selected members`}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Choose Department
      </DialogContentText>
      <Autocomplete
        disablePortal
        onChange={(_, dep) => {
          setChosenDepId(dep!.depId);
        }}
        options={departmentList}
        getOptionKey={(department) => department.depId}
        getOptionLabel={(department) => department.depName}
        slotProps={{
          paper: {
            sx: {
              border: "2px solid #2c2c2c",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              mt: 0.5,
              "& .MuiAutocomplete-option": {
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
                '&[aria-selected="true"]': {
                  backgroundColor: "#e5e7eb !important",
                },
              },
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Department"
            error={departmentEmpty}
            data-testid="textfield"
            helperText={
              departmentEmpty
                ? "Select a department"
                : "Proline staff, please ignore this field"
            }
          ></TextField>
        )}
      ></Autocomplete>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogClose}>
        Cancel
      </Button>
      <Button onClick={handleConfirmChangeDepartment} autoFocus>
        Save
      </Button>
    </DialogActions>
  </Dialog>)
}
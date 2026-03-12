import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Snackbar,
  Alert
} from "@mui/material"
import { useState } from "react";
import { changeDepartmentForUsers } from "../request";

interface MemberRow { user_id: number, full_name: string, email: string, phone_number: string }

export const ChangeDepartmentDialog = ({ departmentList, dialogOpen, handleDialogClose, selectedRows }: { departmentList: { depId: number, depName: string }[], dialogOpen: boolean, handleDialogClose: (isSucceed: boolean, chosenDepId?: number) => void, selectedRows: MemberRow[] }) => {

  const [chosenDepId, setChosenDepId] = useState<number | null>(null);
  const [departmentEmpty, setDepartmentEmpty] = useState(false);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    status: 'error',
    message: ''
  })
  const handleConfirmChangeDepartment = () => {
    if (chosenDepId === null) {
      setDepartmentEmpty(true);
      return;
    }
    changeDepartmentForUsers(selectedRows.map(row => row.user_id), chosenDepId!).then(res => {
      if (res.status === 200) {
        res.json().then(() => {
          setDepartmentEmpty(false);
          handleDialogClose(true, chosenDepId!);
        })
      } else {
        setSnackbarState({
          open: true,
          status: 'error',
          message: 'Change department failed, try again later!'
        })
      }
    })
  }

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            overflowY: "visible"
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {`Change department for ${selectedRows.length} selected members`}
        </DialogTitle>
        <DialogContent sx={{ overflowY: "visible" }}>
          <DialogContentText id="alert-dialog-description" sx={{ mb: 1}}>
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
                  mt: 2,
                  "& .MuiAutocomplete-option": {
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                      borderLeft: 3
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
                    && "Select a department"
                }
              ></TextField>
            )}
          ></Autocomplete>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmChangeDepartment} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
    </>
  )
}
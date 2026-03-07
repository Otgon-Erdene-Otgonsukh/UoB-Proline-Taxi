import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import { useState } from "react";
import { createDepartment } from "../request";

const AddDepartmentDialog = ({ dialogOpen, handleDialogClose }: { dialogOpen: boolean, handleDialogClose: () => void }) => {

  const [formData, setFormData] = useState<{
    name: string,
  }>({
    name: '',
  })

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    status: 'error',
    message: ''
  })

  const handleSubmit = () => {
    if (!formData.name) {
      setSnackbarState({
        open: true,
        status: 'error',
        message: 'Name field cannot be empty!'
      })
    } else {
      createDepartment(formData.name).then(res => {
        if (res.status === 200) {
          res.json().then(() => {
            setSnackbarState({
              open: true,
              status: 'success',
              message: 'Create new department successfully!'
            })
            handleDialogClose()
          })
        } else {
          setSnackbarState({
            open: true,
            status: 'error',
            message: 'Some error occurs, try again later!'
          })
        }
      })

    }
  }

  return (<div>
    <Dialog
      onClose={handleDialogClose}
      aria-labelledby="customized-dialog-title"
      open={dialogOpen}
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
        Add New Department
      </DialogTitle>
      <DialogContent dividers>
      <TextField
        fullWidth
        label="Department Name"
        id="depNameInput"
        value={formData.name}
        onChange={(e) => { setFormData({ ...formData, name: e.target.value }); }}
        size="small"
        sx={{ minWidth: 150 }}
      />
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
        <Button
          fullWidth
          onClick={handleSubmit}
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
          Add department
        </Button>
      </DialogActions>
    </Dialog>
    <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarState.open}
        onClose={() => setSnackbarState({open: false, status: 'error', message: ''})}
      >
        <Alert
          onClose={() => setSnackbarState({open: false, status: 'error', message: ''})}
          severity={snackbarState.status === 'success' ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
  </div>)
}

export default AddDepartmentDialog;

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material"
import { useState } from "react";

interface MemberRow { user_id: number, full_name: string, email: string, phone_number: string }

export const ChangeDepartmentDialog = ({ dialogOpen, handleDialogClose, selectedRows }: { dialogOpen: boolean, handleDialogClose: () => void, selectedRows: MemberRow[] }) => {

  const [chosenDepId, setChosenDepId] = useState<number | null>(null);

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
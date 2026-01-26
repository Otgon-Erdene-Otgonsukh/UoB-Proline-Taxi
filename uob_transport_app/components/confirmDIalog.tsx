import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export default function ConfirmDialog({ open, dialogTitle, confirmMessage, confirmButtonText, cancelButtonText, confirmCallBack, cancelCallBack }: { open: boolean; dialogTitle: string; confirmMessage: string; confirmButtonText?: string; cancelButtonText?: string; confirmCallBack: () => void; cancelCallBack: () => void; }) {

  return (
    <Dialog
      open={open}
      onClose={cancelCallBack}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {confirmMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelCallBack}>{cancelButtonText ?? "Cancel"}</Button>
        <Button onClick={confirmCallBack} autoFocus>
          {confirmButtonText ?? "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

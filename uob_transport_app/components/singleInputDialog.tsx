import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function SingleInputDialog({ open, dialogTitle, dialogMessage, inputLabel, inputValue, confirmButtonText, cancelButtonText, confirmCallBack, cancelCallBack }: { open: boolean; dialogTitle: string; dialogMessage?: string; inputLabel?: string; inputValue?: string, confirmButtonText?: string; cancelButtonText?: string; confirmCallBack: (input: string) => void; cancelCallBack: () => void; }) {

  const [inputContent, setInputContent] = useState(inputValue ?? "");

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
        {dialogMessage && <DialogContentText id="alert-dialog-description">
          {dialogMessage}
        </DialogContentText>}
        <TextField
          autoFocus
          margin="dense"
          id="input"
          label={inputLabel ?? "Input"}
          type="text"
          fullWidth
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelCallBack}>{cancelButtonText ?? "Cancel"}</Button>
        <Button onClick={() => confirmCallBack(inputContent)} autoFocus>
          {confirmButtonText ?? "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

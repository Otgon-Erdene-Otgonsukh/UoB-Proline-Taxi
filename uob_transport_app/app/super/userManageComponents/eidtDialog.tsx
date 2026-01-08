import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  TextField,
} from "@mui/material";
import {
  Close as CloseIcon,
  FindInPage as FindInPageIcon,
} from "@mui/icons-material"
import { UserRecord } from "@/model/models";

const Page = ({ editData, dialogOpen, handleDialogClose }: { editData: UserRecord, dialogOpen: boolean, handleDialogClose: () => void }) => {

  const [formInput, setFormInput] = useState<UserRecord>(editData)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('submit');
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
        Edit User
        <FindInPageIcon
          sx={{ fontSize: 35, mb: 1, ml: 1, mr: -1 }}
        ></FindInPageIcon>
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
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <TextField
            fullWidth
            label="Name"
            id="nameInput"
            value={formInput.name}
            onChange={(e) => { setFormInput({ ...formInput, name: e.target.value }); }}
            sx={{ minWidth: 150 }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  </div>)
}

export default Page;

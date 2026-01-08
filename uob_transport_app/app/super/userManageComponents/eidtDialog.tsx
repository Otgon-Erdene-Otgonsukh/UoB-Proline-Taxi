import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from "@mui/material";
import {
  Close as CloseIcon,
  FindInPage as FindInPageIcon,
  Email as EmailIcon
} from "@mui/icons-material"
import { UserRecord } from "@/model/models";
import { userStatusToIntMap, userStatusToStrMap } from "../../super/constants";
import { roles } from "../../super/constants";

const Page = ({ editData, dialogOpen, handleDialogClose }: { editData: UserRecord, dialogOpen: boolean, handleDialogClose: () => void }) => {

  const [formInput, setFormInput] = useState<UserRecord>(editData)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('submit');
  }

  const [mailEmpty, setMailEmpty] = useState(false);
  const [invalidMail, setInvalidMail] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput({ ...formInput, email: e.target.value })
    if (e.target.value.length === 0) {
      setMailEmpty(true);
      setInvalidMail(false);
    } else if (!e.target.value.includes("@")) {
      setInvalidMail(true);
      setMailEmpty(false);
    } else {
      setInvalidMail(false);
      setMailEmpty(false);
    }
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
          <TextField
            fullWidth
            label="Email"
            id="emailInput"
            error={mailEmpty || invalidMail}
            value={formInput.email}
            onChange={handleEmailChange}
            sx={{ minWidth: 150 }}
            helperText={
              mailEmpty
                ? "Enter email the code to be sent!"
                : invalidMail
                  ? "Please enter a valid email address!"
                  : ""
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon sx={{ color: "#111827" }} />
                  </InputAdornment>
                ),
              }
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="searchUserStatusInput">Role</InputLabel>
            <Select
              label="UserStatus"
              id="searchUserStatusInput"
              value={formInput.role}
              onChange={(e) => { setFormInput({ ...formInput, role: e.target.value }); }}
            >
              {roles.map(e => {
                return <MenuItem value={e} key={e}>{e}</MenuItem>
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="searchUserStatusInput">User Status</InputLabel>
            <Select
              label="UserStatus"
              id="searchUserStatusInput"
              value={formInput.user_status}
              onChange={(e) => { setFormInput({ ...formInput, user_status: e.target.value }); }}
            >
              <MenuItem value={userStatusToIntMap.pending}>{userStatusToStrMap[userStatusToIntMap.pending]}</MenuItem>
              <MenuItem value={userStatusToIntMap.normal}>{userStatusToStrMap[userStatusToIntMap.normal]}</MenuItem>
              <MenuItem value={userStatusToIntMap.rejected}>{userStatusToStrMap[userStatusToIntMap.rejected]}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
    </Dialog>
  </div>)
}

export default Page;

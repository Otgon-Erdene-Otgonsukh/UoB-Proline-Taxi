import { useEffect, useState } from "react";
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
  InputAdornment,
  Button,
  Autocomplete,
} from "@mui/material";
import {
  Close as CloseIcon,
  FindInPage as FindInPageIcon,
  Email as EmailIcon,
  LocalPhone as LocalPhoneIcon
} from "@mui/icons-material"
import { UserRecord } from "@/model/models";
import { userStatusToIntMap, userStatusToStrMap } from "../../super/constants";
import { roles } from "../../super/constants";
import { getDepartmentsList } from "../requests";
import { department } from "@/generated/prisma/client";

const countryCodeList = [{
  code: "+44", label: "UK"
}, {
  code: "+1", label: "US/CA"
}, {
  code: "+91", label: "IN"
}, {
  code: "+86", label: "CN"
}, {
  code: "+61", label: "AU"
}, {
  code: "+33", label: "FR"
}, {
  code: "+49", label: "DE"
}, {
  code: "+81", label: "JP"
}];

type UserFormInputType = {
  name: string,
  email: string,
  countryCode: string,
  phoneNumber: string,
  role: string,
  userStatus: number,
  department: department,
}

const Page = ({ editData, dialogOpen, handleDialogClose }: { editData: UserRecord, dialogOpen: boolean, handleDialogClose: () => void }) => {

  const [formInput, setFormInput] = useState<UserFormInputType>({
    name: editData.name,
    email: editData.email,
    countryCode: editData.phone_number.split(" ")[0] || "",
    phoneNumber: editData.phone_number.split(" ")[1] || "",
    role: editData.role,
    userStatus: editData.user_status,
    department: editData.department,
  })

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

  const [phoneNumberEmpty, setPhoneNumberEmpty] = useState(false);

  const [departments, setDepartments] = useState<UserRecord["department"][]>([])

  useEffect(() => {
    getDepartmentsList().then(async (res) => {
      if (res.status === 200) {
        const data = await res.json();
        setDepartments(data);
      }
    })
  }, [])

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
          <div className="flex gap-3">
            <Select
              label=""
              id="phoneInput"
              value={formInput.countryCode}
              onChange={(e) => { setFormInput({ ...formInput, countryCode: e.target.value }); }}
            >
              {countryCodeList.map(e => {
                return <MenuItem value={e.code} key={e.code}>{e.label + '(' + e.code + ')'}</MenuItem>
              })}
            </Select>
            <TextField
              fullWidth
              error={phoneNumberEmpty}
              helperText={
                phoneNumberEmpty ? "Please enter phone number" : ""
              }
              value={formInput.phoneNumber}
              label="Phone Number"
              id="phoneNumber"
              type="tel"
              onChange={(e) => {
                setFormInput({ ...formInput, phoneNumber: e.target.value });
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <LocalPhoneIcon sx={{ color: "#111827" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="roleInput">Role</InputLabel>
            <Select
              label="Role"
              id="roleInput"
              value={formInput.role}
              onChange={(e) => { setFormInput({ ...formInput, role: e.target.value }); }}
            >
              {roles.map(e => {
                return <MenuItem value={e} key={e}>{e}</MenuItem>
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="userStatusInput">User Status</InputLabel>
            <Select
              label="UserStatus"
              id="userStatusInput"
              value={formInput.userStatus}
              onChange={(e) => { setFormInput({ ...formInput, userStatus: e.target.value }); }}
            >
              <MenuItem value={userStatusToIntMap.pending}>{userStatusToStrMap[userStatusToIntMap.pending]}</MenuItem>
              <MenuItem value={userStatusToIntMap.normal}>{userStatusToStrMap[userStatusToIntMap.normal]}</MenuItem>
              <MenuItem value={userStatusToIntMap.rejected}>{userStatusToStrMap[userStatusToIntMap.rejected]}</MenuItem>
            </Select>
          </FormControl><FormControl sx={{ minWidth: 150 }}>
            <Autocomplete
              disablePortal
              options={departments}
              getOptionLabel={(option) => option.dep_name}
              renderInput={(params) => <TextField {...params} label="Departments" />}
              value={editData.department}
            />
          </FormControl>
          <div className="flex justify-around gap-4">
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#2c2c2c",
                py: 1.5,
                mt: 1,
                "&:hover": { bgcolor: "#414040", transform: "scale(1.01)" },
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
                borderRadius: "0.375rem",
                transition: "transform 0.2s",
              }}
            >
              Save
            </Button>
            <Button
              fullWidth
              onClick={handleDialogClose}
              sx={{
                color: "#2c2c2c",
                py: 1.5,
                mt: 1,
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
                borderRadius: "0.375rem",
                transition: "transform 0.2s",
              }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  </div>)
}

export default Page;

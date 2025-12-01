"use client";

import {
  Box,
  Paper,
  Button,
  Typography,
  InputAdornment,
  TextField,
  Alert,
} from "@mui/material";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import { sendResetEmail } from "./reqeust";

export default function Forgot() {
  //simple client side validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //preventing the default behaviour as no back end is implemented

    //reseting all previous submission states
    setInvalidMail(false);
    setMailEmpty(false);
    handleCloseAlterMessage()

    if (mail.length == 0) {
      setMailEmpty(true);
      return;
    } else if (!mail.includes("@")) {
      //checking if the input is a valid mail
      setInvalidMail(true);
      return;
    } else {
      sendResetEmail(mail).then(res => {
        if (res.status === 200) {
          res.json().then(data => {
            console.log(data);
            setAlterMessageMeta({
              show: true,
              status: 'success',
              message: 'Code sent successfully! Check your email.'
            })
          })
        } else {
          res.json().then(data => {
            console.log(data);
            setAlterMessageMeta({
              show: true,
              status: 'error',
              message: data.message,
            })
          })
        }
      })
    }
  };

  const [mailEmpty, setMailEmpty] = useState(false);
  const [alertMessageMeta, setAlterMessageMeta] = useState<{
    show: boolean,
    status: 'success' | 'error',
    message: string
  }>({
    show: false,
    status: 'success',
    message: ''
  });
  const handleCloseAlterMessage = () => {
    setAlterMessageMeta({
      ...alertMessageMeta,
      show: false,
    })
  }
  const [invalidMail, setInvalidMail] = useState(false);
  const [mail, setMail] = useState("");

  return (
    <div className="flex flex-col justify-center items-center min-h-screen font-inter p-4">
      <Paper
        elevation={3}
        sx={{
          borderRadius: 5,
          maxWidth: 500,
          width: "100%",
          mt: 10,
          mb: 20,
          overflow: "hidden",
          border: 3,
        }}
      >
        <Box
          sx={{
            background: "#2c2c2c",
            color: "white",
            py: 1,
            pt: 3
          }}
        >
          <Typography
            variant="h4"
            className="text-shadow-lg/20"
            sx={{
              fontFamily: "aleo",
              textAlign: "center",
              fontWeight: 600,
              fontSize: { xs: "1.5rem", sm: "2rem" },
              mb: 1,
            }}
          >
            Confirm Mail
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            p: { xs: 4, sm: 5, md: 6 },
          }}
        >
          {alertMessageMeta.show && (
            <Alert
              severity={alertMessageMeta.status}
              onClose={handleCloseAlterMessage}
              sx={{ borderRadius: "0.375rem" }}
            >
              {alertMessageMeta.message}
            </Alert>
          )}

          <TextField
            error={mailEmpty || invalidMail}
            fullWidth
            label="Email"
            id="email"
            helperText={
              mailEmpty
                ? "Enter email the code to be sent!"
                : invalidMail
                  ? "Please enter a valid email address!"
                  : ""
            }
            value={mail}
            onChange={(e) => {
              setMail(e.target.value);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.375rem",
                "& fieldset": {
                  borderWidth: "2px",
                  borderColor: "#111827",
                },
                "&:hover fieldset": {
                  borderColor: "#111827",
                },
                "&.Mui-focused fieldset": {
                  borderWidth: "2px",
                  borderColor: "#111827",
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.875rem",
                color: "#111827",
                "&.Mui-focused": {
                  color: "#111827",
                },
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon sx={{ color: "#111827" }} />
                  </InputAdornment>
                ),
              },
            }}
          ></TextField>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#2c2c2c",
              py: 1.5,
              mt: 1,
              "&:hover": { bgcolor: "#414040", transform: "scale(1.01)" },
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
              borderRadius: "0.375rem",
              transition: "transform 0.2s",
            }}
            endIcon={<SendIcon />}
          >
            Send Code
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

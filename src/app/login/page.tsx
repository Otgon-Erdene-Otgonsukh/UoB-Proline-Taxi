"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Snackbar, Alert } from "@mui/material";
import { userLogin } from "./request";

export default function Log_forgot() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isMailEmpty = mail.length == 0;
    const isPassEmpty = password.length == 0;

    setMailEmpty(isMailEmpty);
    setPassEmpty(isPassEmpty);

    if (!isMailEmpty && !isPassEmpty) {
      userLogin(mail, password).then(res => {
        if (res.status !== 200) {
          setSnackbarState({ open: true, status: 'fail' })
        } else {
          res.json().then(data => {
            localStorage.setItem('token', data.token)
            setSnackbarState({ open: true, status: 'success' })
            router.push("/home");
          });
        }
      })
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [mailEmpty, setMailEmpty] = useState(false);
  const [passEmpty, setPassEmpty] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    status: 'success'
  })

  const handleCloseSnackbarState = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    })
  }

  return (
    <div className="flex min-h-screen justify-center items-center font-inter p-4">
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarState.open}
        onClose={handleCloseSnackbarState}
      >
        <Alert
          onClose={handleCloseSnackbarState}
          severity={snackbarState.status === 'success' ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarState.status === 'success' ? 'Login success!' : 'Login failed! Try again'}
        </Alert>
      </Snackbar>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 5,
          mt: 25,
          mb: 20
        }}
      >
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
          <Typography
            variant="h4"
            className="text-shadow-lg/20"
            sx={{
              textAlign: "center",
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontWeight: 600,
              fontFamily: "aleo",
              mb: 2,
            }}
          >
            LOG IN
          </Typography>

          <TextField
            fullWidth
            error={mailEmpty}
            helperText={mailEmpty ? "Enter email!" : ""}
            label="Email"
            id="email"
            type="email"
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
          />

          <TextField
            fullWidth
            error={passEmpty}
            helperText={passEmpty ? "Enter password!" : ""}
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
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
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: "#111827", mr: -1 }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ textAlign: "left" }}>
            <Link
              href="/forgot"
              underline="hover"
              sx={{
                fontSize: "0.875rem",
                color: "#111827",
                "&:hover": {
                  color: "#374151",
                },
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#2c2c2c",
              color: "white",
              py: 1.5,
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 300,
              "&:hover": {
                bgcolor: "#414040",
                transform: "scale(1.01)",
              },
              transition: "all 0.2s",
            }}
          >
            LOG IN
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

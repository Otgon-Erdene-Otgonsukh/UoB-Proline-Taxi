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
  CircularProgress
} from "@mui/material";
import Link from "next/link";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Snackbar, Alert } from "@mui/material";
import { signIn } from "next-auth/react"

export default function Log_forgot() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isMailEmpty = mail.length == 0;
    const isPassEmpty = password.length == 0;

    setMailEmpty(isMailEmpty);
    setPassEmpty(isPassEmpty);


    if (!isMailEmpty && !isPassEmpty) {
      setLoadingBar(true);
      // Use NextAuth for authentication, stores cookie automatically.
      signIn('credentials', {
        redirect: false, // Force NExtAuth not to redirect.
        email: mail,
        password: password,
      }).then(res => {
        if (res.status !== 200) {
          setSnackbarState({ open: true, status: 'fail' })
        } else {
          setSnackbarState({ open: true, status: 'success' })
          router.push("/home");
        }
      })
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [mailEmpty, setMailEmpty] = useState(false);
  const [passEmpty, setPassEmpty] = useState(false);
  const [loadingBar, setLoadingBar] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotClick = () => {
    router.push("/forgot");
  }

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
          maxWidth: 450,
          width: "100%",
          borderRadius: 5,
          mt: 10,
          mb: 20,
          overflow: "hidden",
          border: 3
        }}
      >
        <Box
          sx={{
            bgcolor: "#2c2c2c",
            color: "white",
            py: 3,
            textAlign: "center"
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontWeight: 600,
              fontFamily: "aleo",
            }}
          >
            LOG IN
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            p: { xs: 4, sm: 5, md: 6 },
          }}
        >          <TextField
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
            <Button variant="text" onClick={handleForgotClick}
              sx={{
                fontSize: "0.875rem",
                textTransform: "capitalize",
                color: "#111827",
                "&:hover": {
                  color: "#374151",
                },
                mb: -1,
                mt: -1
              }}
            >
              Forgot password?
            </Button>
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
            {loadingBar ? <CircularProgress color="inherit" size="30px" /> : "LOG IN"}
          </Button>
          <Typography sx={{ textAlign: "center", mb: -2 }}>Don&apos;t have an account? <Link href="/register" className="text-blue-600">Sign up</Link></Typography>
        </Box>
      </Paper>
    </div>
  );
}

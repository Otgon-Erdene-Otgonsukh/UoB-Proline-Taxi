"use client";
import { useSearchParams, useRouter, } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { getUserResetByUuid, resetPassword } from "./request";
import { user_reset } from "@/generated/prisma/client";

const Page = () => {
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid')
  console.log(uuid);

  const router = useRouter();

  const [pageValid, setPageValid] = useState(true)
  const [userReset, setUserReset] = useState<user_reset>()

  useEffect(() => {

    if (uuid) {
      getUserResetByUuid(uuid).then(res => {
        if (res.status !== 200) {
          setPageValid(false)
        } else {
          res.json().then((data) => {
            setUserReset(data)
          })
        }
      })
    } else {
      setPageValid(false)
    }

  }, [uuid]);

  const [passEmpty, setPassEmpty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassError, setConfirmPassError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPassError(e.target.value !== password)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isPassEmpty = password.length == 0;
    const isConfirmPassWrong = confirmPassword !== password;

    setPassEmpty(isPassEmpty);
    setConfirmPassError(isConfirmPassWrong)
    if (!isPassEmpty && !isConfirmPassWrong) {
      resetPassword(uuid!, password).then(res => {
        if (res.status === 200) {
          setSnackbarState({
            open: true,
            status: 'success'
          })
          router.push('/login')
        } else {
          setSnackbarState({
            open: true,
            status: 'fail'
          })
        }
      })

    }
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

  return pageValid ? (
    <div className="flex min-h-screen justify-center items-center font-inter p-4">
      <Paper
        elevation={3}
        sx={{
          maxWidth: 500,
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
            RESET PASSWORD
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

          <TextField
            fullWidth
            error={confirmPassError}
            helperText={confirmPassError ? "Confirm password should be the same as the password" : ""}
            label="Confirm password"
            id="password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
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
            RESET PASSWORD
          </Button>
        </Box>
      </Paper>
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
          {snackbarState.status === 'success' ? 'Reset Password Success!' : 'Reset password failed! Try again later!'}
        </Alert>
      </Snackbar>
    </div>
  ) : (
    <div className="flex min-h-screen justify-center items-center font-inter p-4">
      <h1 className="inline-block mr-1 pr-1 font-medium font-aleo">404 | This page has been expired</h1>
    </div>
  )

}

export default Page;

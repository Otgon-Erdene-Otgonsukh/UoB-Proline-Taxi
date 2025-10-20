"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

interface LogInPageStatus {
  logIn: boolean;
  forgot: boolean;
  codeSent: boolean;
  reset: boolean;
}

export default function LogInAndForgot({
  logIn,
  forgot,
  codeSent,
  reset,
}: LogInPageStatus) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    logIn && (
      <div className="flex min-h-screen justify-center items-center font-inter p-4">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, sm: 5, md: 6 },
            borderRadius: 2,
            maxWidth: 500,
            width: "100%",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              component="h1"
              className="font-aleo"
              sx={{
                mb: 4,
                textAlign: "center",
                fontSize: { xs: "1.5rem", sm: "2rem" },
                fontWeight: 600,
              }}
            >
              LOGIN
            </Typography>

            <TextField
              fullWidth
              error
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                mb: 3,
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
            />

            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                mb: 4,
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
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 300,
                "&:hover": {
                  bgcolor: "#414040",
                  transform: "scale(1.01)",
                },
                transition: "all 0.2s",
              }}
            >
              LOGIN
            </Button>
          </Box>
        </Paper>
      </div>
    )
  );
}

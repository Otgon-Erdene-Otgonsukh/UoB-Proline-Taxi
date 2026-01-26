import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { BookingWithTrip } from "@/app/dep-dashboard/constants";

export default function Page({ open, handleDialogClose, viewData }: { open: boolean; handleDialogClose: () => void; viewData: BookingWithTrip; }) {
  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-labelledby="label"
      aria-describedby="description"
    >
      <DialogTitle
        id="label"
        sx={{
          color: "white",
          textAlign: "center",
          fontSize: 30,
          fontWeight: "bold",
          font: "aleo",
          bgcolor: "#2c2c2c",
          fontFamily: "aleo",
        }}
      >
        Booking Detail
        <FindInPageIcon
          sx={{ fontSize: 35, mb: 1, ml: 1, mr: -1 }}
        ></FindInPageIcon>
      </DialogTitle>
      <DialogContent dividers>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: 20 }}
          >
            Information about lead passenger:
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            First name:
          </Typography>
          <Typography gutterBottom>
            {viewData?.first_name}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Last name:
          </Typography>
          <Typography gutterBottom>{viewData?.surname}</Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Phone number:
          </Typography>
          <Typography gutterBottom>
            {viewData?.tel_number}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Email:
          </Typography>
          <Typography gutterBottom>{viewData?.email}</Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Department:
          </Typography>
          <Typography gutterBottom>
            {viewData?.department}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
            mt: 4,
          }}
        >
          <Typography
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: 19 }}
          >
            Information about booking:
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Time Created:
          </Typography>
          <Typography gutterBottom>
            {viewData?.time_created
              ? new Date(viewData?.time_created).toLocaleString()
              : ""}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            From:
          </Typography>
          <Typography gutterBottom>
            {viewData?.trip.airport === "" ||
              viewData?.trip.airport === null
              ? viewData?.trip.pickup_location
              : viewData?.trip.airport}
          </Typography>
        </Stack>
        {viewData?.trip.flight_num && (
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "400px",
            }}
          >
            <Typography gutterBottom sx={{ fontWeight: "bold" }}>
              Flight number:
            </Typography>
            <Typography gutterBottom>
              {viewData.trip.flight_num}
            </Typography>
          </Stack>
        )}
        {viewData?.trip.via && (
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "400px",
            }}
          >
            <Typography gutterBottom sx={{ fontWeight: "bold" }}>
              Via:
            </Typography>
            <Typography gutterBottom>
              {viewData?.trip.via}
            </Typography>
          </Stack>
        )}
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            To:
          </Typography>
          <Typography gutterBottom>
            {viewData?.trip.dropoff_location}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Booking Status:
          </Typography>
          {viewData?.booking_status === "Approved" ? (
            <span className="inline-block px-10 py-[3px] rounded-full text-xs font-medium border border-green-800 bg-green-200 text-green-800">
              Approved
            </span>
          ) : viewData?.booking_status === "Rejected" ? (
            <span className="inline-block px-10 py-[3px] rounded-full text-xs font-medium border border-red-800 bg-red-200 text-red-800">
              Rejected
            </span>
          ) : (
            <span className="inline-block px-10 py-[3px] rounded-full text-xs font-medium border border-yellow-800 bg-yellow-200 text-yellow-800">
              Pending
            </span>
          )}
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Passenger Number:
          </Typography>
          <Typography gutterBottom>
            {viewData?.trip.passenger_num}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "400px",
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Pick Up Time:
          </Typography>
          <Typography gutterBottom>
            {viewData?.trip.pickup_time
              ? new Date(viewData?.trip.pickup_time).toLocaleString()
              : ""}
          </Typography>
        </Stack>
        {viewData?.trip.return_drop_loc && (
          <>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Return trip pick-up time:
              </Typography>
              <Typography gutterBottom>
                {viewData?.trip.return_pickup_time
                  ? new Date(
                    viewData?.trip.return_pickup_time
                  ).toLocaleString()
                  : ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "400px",
              }}
            >
              <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                Return Drop-off Location:
              </Typography>
              <Typography gutterBottom sx={{ textAlign: "right" }}>
                {viewData?.trip.return_drop_loc}
              </Typography>
            </Stack>
          </>
        )}
        {viewData?.trip.PO !== null && (
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "400px",
            }}
          >
            <Typography gutterBottom sx={{ fontWeight: "bold" }}>
              PO number:
            </Typography>
            <Typography gutterBottom>{viewData?.trip.PO}</Typography>
          </Stack>
        )}
        {viewData?.additional_info && (
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "400px",
            }}
          >
            <Typography gutterBottom sx={{ fontWeight: "bold" }}>
              Additional info:
            </Typography>
            <Typography gutterBottom sx={{ textAlign: "right" }}>
              {viewData?.additional_info}
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDialogClose}
          sx={{
            mr: 2,
            mt: 2,
            mb: 1,
            color: "#2c2c2c",
            ":hover": {
              bgcolor: "#2c2c2c",
              color: "white",
            },
            transition: "all 300ms",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
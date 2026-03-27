import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Stack, Button, Chip } from "@mui/material";
import {
  Close as CloseIcon,
  FindInPage as FindInPageIcon,
} from "@mui/icons-material";
import { BookingRecord, Location } from "@/model/models";

const Page = ({ viewData, dialogOpen, handleDialogClose }: { viewData: BookingRecord, dialogOpen: boolean, handleDialogClose: () => void }) => {
  return (<Dialog
    onClose={handleDialogClose}
    aria-labelledby="customized-dialog-title"
    open={dialogOpen}
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
        fontSize: {
          md: 28,
          xs: 24
        },
      }}
      id="customized-dialog-title"
    >
      Booking Detail
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
    <DialogContent dividers>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          width: {
            md: "400px",
            xs: "280px"
          },
        }}
      >
        <Typography gutterBottom sx={{ fontWeight: "bold" }}>
          Time Created:
        </Typography>
        <Typography gutterBottom textAlign="right">
          {viewData?.time_created
            ? new Date(viewData?.time_created).toLocaleString()
            : ""}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "top",
          width: {
            md: "400px",
            xs: "280px"
          },
        }}
      >
        <Typography gutterBottom sx={{ fontWeight: "bold" }}>
          From:
        </Typography>
        <Typography gutterBottom align="right">
          {(viewData?.trip.pickup_location as unknown as string).includes("{")
                ? JSON.parse(viewData.trip.pickup_location as unknown as string).address.includes(
                    "University of Bristol",
                  ) // Temporary check to see if this is an old style booking.
                  ? JSON.parse(viewData?.trip.pickup_location as unknown as string).address
                  : JSON.parse(viewData.trip.pickup_location as unknown as string).short_name +
                    ", " +
                    JSON.parse(viewData?.trip.pickup_location as unknown as string)
                      .address.split(",")
                      .slice(-5)[0]
                      .trim()
                : viewData?.trip.pickup_location
              }
        </Typography>
      </Stack>
      {viewData?.trip.flight_num && (
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              md: "400px",
              xs: "280px"
            },
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
      {viewData?.trip.via && (viewData?.trip.via as unknown as string).includes("{") && (
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "top",
            width: {
              md: "400px",
              xs: "280px"
            },
          }}
        >
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Via:
          </Typography>
          <Typography gutterBottom align="right" sx={{ whiteSpace: "pre-line" }}>
            {(viewData?.trip.via as unknown as string).includes("{")
                ? JSON.parse(viewData?.trip.via as unknown as string)
                    .map(
                      (loc: Location) =>
                        loc.short_name +
                        ", " +
                        loc.address.split(",").slice(-5)[0].trim(),
                    )
                    .join("\n")
                : JSON.parse(viewData?.trip.via as unknown as string).length === 0
                  ? "N/A"
                  : viewData?.trip.via}
            </Typography>
        </Stack>
      )}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "top",
          width: {
            md: "400px",
            xs: "280px"
          },
        }}
      >
        <Typography gutterBottom sx={{ fontWeight: "bold" }}>
          To:
        </Typography>
        <Typography gutterBottom align="right">
          {(viewData?.trip.dropoff_location as unknown as string).includes("{") // Temporary check to see if this is an old style booking.
              ? JSON.parse(viewData?.trip.dropoff_location as unknown as string).address.includes(
                  "University of Bristol",
                ) // Temporary check to see if this is an old style booking.
                ? JSON.parse(viewData?.trip.dropoff_location as unknown as string).address
                : JSON.parse(viewData?.trip.dropoff_location as unknown as string).short_name +
                  ", " +
                  JSON.parse(viewData?.trip.dropoff_location as unknown as string)
                    .address.split(",")
                    .slice(-5)[0]
                    .trim()
              : viewData?.trip.dropoff_location}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          width: {
            md: "400px",
            xs: "280px"
          },
        }}
      >
        <Typography gutterBottom sx={{ fontWeight: "bold" }}>
          Booking Status:
        </Typography>
        <Chip
          size="small"
          color={`${viewData?.booking_status === "Approved"
            ? "success"
            : viewData?.booking_status === "Pending"
              ? "warning"
              : viewData?.booking_status === "Cancelled"
                ? "default"
                : "error"
            }`}
          label={viewData?.booking_status}
        />
      </Stack>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          width: {
            md: "400px",
            xs: "280px"
          },
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
          width: {
            md: "400px",
            xs: "280px"
          },
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
              width: {
                md: "400px",
                xs: "280px"
              },
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
              width: {
                md: "400px",
                xs: "280px"
              },
            }}
          >
            <Typography gutterBottom sx={{ fontWeight: "bold" }}>
              Return Drop-off Location:
            </Typography>
            <Typography gutterBottom>
              {viewData?.trip.return_drop_loc as unknown as string}
            </Typography>
          </Stack>
        </>
      )}
      {viewData?.trip.PO && (
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: {
              md: "400px",
              xs: "280px"
            },
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
            width: {
              md: "400px",
              xs: "280px"
            },
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
        sx={{
          color: "#2c2c2c",
          mr: 1,
          transition: "all 250ms",
          ":hover": { bgcolor: "#2c2c2c", color: "white" },
        }}
        onClick={handleDialogClose}
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>)
}

export default Page;

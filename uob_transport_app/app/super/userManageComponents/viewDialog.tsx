import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Button,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  FindInPage as FindInPageIcon
} from "@mui/icons-material"
import { UserRecord } from "@/model/models";
import { userStatusToIntMap, userStatusToStrMap } from "../../super/constants";
import CustomizedButton from "@/components/CustomizedButton";

const Page = ({ viewData, dialogOpen, handleDialogClose }: { viewData: UserRecord, dialogOpen: boolean, handleDialogClose: () => void }) => {

  const handleViewBookings = () => {
    console.log("view bookings clicked");
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
        User Detail
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
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Time Created:
          </Typography>
          <Typography gutterBottom>
            {viewData?.time_created
              ? new Date(viewData?.time_created).toLocaleString()
              : ""}
          </Typography>
        </Stack>
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Name:
          </Typography>
          <Typography gutterBottom>
            {viewData.name + ' ' + viewData.surname}
          </Typography>
        </Stack>
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            email
          </Typography>
          <Typography gutterBottom>
            {viewData.email}
          </Typography>
        </Stack>
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Phone Number:
          </Typography>
          <Typography gutterBottom>{viewData?.phone_number}</Typography>
        </Stack>
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Role:
          </Typography>
          <Typography gutterBottom>
            {viewData?.role}
          </Typography>
        </Stack>
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            User Status:
          </Typography>
          <Chip
            size="small"
            color={`${viewData?.user_status === userStatusToIntMap.normal
              ? "success"
              : viewData?.user_status === userStatusToIntMap.pending
                ? "warning"
                : viewData?.user_status === userStatusToIntMap.rejected
                  ? "default"
                  : "error"
              }`}
            label={userStatusToStrMap[viewData?.user_status]}
          />
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Department:
          </Typography>
          <Typography gutterBottom>
            {viewData?.department.dep_name}
          </Typography>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Bookings:
          </Typography>
          <Typography gutterBottom>
            <CustomizedButton
              click={handleViewBookings}
              type="primary"
              title="View"
            />
          </Typography>
        </Stack>
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            Saved Addresses:
          </Typography>
          <Typography gutterBottom>
            <CustomizedButton
              click={handleViewBookings}
              type="primary"
              title="View"
            />
          </Typography>
        </Stack>
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
    </Dialog>
  </div>)
}

export default Page;

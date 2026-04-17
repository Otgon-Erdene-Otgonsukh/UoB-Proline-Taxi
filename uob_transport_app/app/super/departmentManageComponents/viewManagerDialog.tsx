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
} from "@mui/material";
import {
  Close as CloseIcon,
} from "@mui/icons-material"
import { DepartmentRecord } from "@/model/models";
import { roleReadableStrMap, userStatusToIntMap, userStatusToStrMap } from "../constants";

const ViewDepartmentDialog = ({ viewData, dialogOpen, handleDialogClose }: { viewData: DepartmentRecord['manager'], dialogOpen: boolean, handleDialogClose: () => void }) => {

  const handleUnassignManager = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const res = await fetch("/api/manager_assignment", {
                method: "POST",
                body: JSON.stringify({
                    user_id: viewData?.user_id,
                    isAssign: false
                })
            });

            if (res.ok) {
                handleDialogClose();
            } else {
                alert("Failed to unassign manager. Please try again.");
            }
        } catch (error) {
            alert("Error unassigning manager. Please try again.");
        }
  };

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
        Manager Detail
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
            {viewData!.full_name}
          </Typography>
        </Stack>
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            email
          </Typography>
          <Typography gutterBottom>
            {viewData!.email}
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
            {roleReadableStrMap[viewData!.role]}
          </Typography>
        </Stack>
        <Stack>
          <Typography gutterBottom sx={{ fontWeight: "bold" }}>
            User Status:
          </Typography>
          <Chip
            size="small"
            color={`${viewData?.user_status === userStatusToIntMap.approved
              ? "success"
              : viewData?.user_status === userStatusToIntMap.pending
                ? "warning"
                : viewData?.user_status === userStatusToIntMap.rejected
                  ? "default"
                  : "error"
              }`}
            label={userStatusToStrMap[viewData!.user_status]}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          sx={{
            color: "#2c2c2c",
            mr: 1,
            transition: "all 250ms",
            ":hover": { bgcolor: "#dc2626", color: "white" },
          }}
          onClick={handleUnassignManager}
        >
          Unassign Manager
        </Button>
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

export default ViewDepartmentDialog;

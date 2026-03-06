import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
} from "@mui/icons-material"
import { DepartmentRecord } from "@/model/models";

const AddDepartmentDialog = ({ dialogOpen, handleDialogClose }: { dialogOpen: boolean, handleDialogClose: () => void }) => {

  // TODO 

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
        Add New Department
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
        To Be Implemented
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

export default AddDepartmentDialog;

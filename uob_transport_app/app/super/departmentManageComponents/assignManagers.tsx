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

const AssignManagerDialog = ({ viewData, dialogOpen, handleDialogClose }: { viewData: DepartmentRecord, dialogOpen: boolean, handleDialogClose: () => void }) => {

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
                Assign Managers
            </DialogTitle>
            <Typography sx={{ p: 3 }}>
                department: {viewData?.depName}
            </Typography>
        </Dialog>
    </div>)
}

export default AssignManagerDialog;
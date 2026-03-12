import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f9fafb",
    border: "2px solid #111827",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "0.95rem",
    color: "#111827",
  },
  [`&.${tableCellClasses.body}`]: {
    border: "2px solid #111827",
    textAlign: "center",
    fontSize: "0.875rem",
  },
}));

export const StyledStickyTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#f9fafb",
    borderTop: "2px solid #111827",
    borderBottom: "2px solid #111827",
    borderRight: "2px solid #111827",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "0.95rem",
    color: "#111827",
    "&:first-of-type": {
      borderLeft: "2px solid #111827",
    },
  },
  [`&.${tableCellClasses.body}`]: {
    borderBottom: "2px solid #111827",
    borderRight: "2px solid #111827",
    textAlign: "center",
    fontSize: "0.875rem",
    "&:first-of-type": {
      borderLeft: "2px solid #111827",
    },
  },
}));

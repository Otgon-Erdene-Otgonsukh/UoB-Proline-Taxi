import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const MaterialUISwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#aab4be",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: "url('/airplane-plane-flight.svg')",
        backgroundSize: "20px 20px",
        filter: "brightness(0) invert(1)",
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#2c2c2c",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#585858",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: "url('/user.png')",
      backgroundSize: "18px 18px",
      filter: "brightness(0) invert(1)",
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
  },
}));

export default function CustomSwitch({ onClick }: { onClick?: () => void }) {
  return <MaterialUISwitch onClick={onClick}></MaterialUISwitch>;
}

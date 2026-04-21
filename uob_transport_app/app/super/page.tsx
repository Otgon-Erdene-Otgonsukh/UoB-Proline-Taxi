"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserRecord } from "@/model/models";
import { USER_ROLE } from "@/model/models";
import SuperDashboard from "@/components/SuperDashboard";
import Profile from "../profile/page";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Avatar
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import MenuIcon from "@mui/icons-material/Menu";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import { getDepartmentsList } from "./requests";
import DepartmentManagePage from "./departmentManageComponents/departmentManagePage";
import { UserManagePage } from "./userManageComponents/userManagePage";
import { BookingManagePage } from "./bookingManageComponents/bookingManagePage";
import ExportPage from "./exportManageComponents/export";
import ForbiddenPage from "@/components/ForbiddenPage";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";
import ConfirmDialog from "@/components/confirmDIalog";

const Page = () => {
  // Get NextAuth Session.
  const { status, data } = useSession();
  const [isForbidden, setIsForbidden] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const router = useRouter();

  const [departments, setDepartments] = useState<UserRecord["department"][]>(
    [],
  );

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
    });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    } else if (data && data.user?.account_type !== USER_ROLE.SUPER_ADMIN) {
      // Only super admins can access this page, so if user is not super admin, set forbidden to true to show forbidden page.
      setIsForbidden(true);
    } else if (data && data.user?.account_type === USER_ROLE.SUPER_ADMIN) {
      setIsForbidden(false);
      getDepartmentsList().then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          setDepartments(data);
        }
      });
    }
  }, [status, router]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsDrawerOpen(open);
    };

  const [tabValue, setTabValue] = useState(1);

  if (isForbidden) {
    return <ForbiddenPage />;
  }

  return (
    <div className="flex-col font-inter">
      <header className="w-full bg-[#2c2c2c] text-white p-3 shadow-lg justify-between items-center flex gap-4 sticky top-0 z-50 px-5">
        <div className="flex items-center gap-4">
          <Tooltip title="Open Menu">
            <Button
              onClick={toggleDrawer(true)}
              sx={{ color: "white", minWidth: "40px" }}
            >
              <MenuIcon fontSize="medium" />
            </Button>
          </Tooltip>

          <span className="font-aleo text-2xl sm:text-3xl font-semibold">
            Management Panel
          </span>
        </div>
        <Tooltip title="Log Out">
          <IconButton onClick={() => setSignOutDialogOpen(true)}>
            <LogoutIcon sx={{ color: "white", fontSize: 32 }} />
          </IconButton>
        </Tooltip>
      </header>

      <div className="w-full flex justify-center items-start p-4">
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Typography
              variant="h6"
              sx={{
                p: 2,
                fontWeight: "bold",
                fontFamily: "aleo",
                fontSize: 25,
              }}
            >
              Admin Menu
            </Typography>
            <Divider />
            <List>
              <ListItem disablePadding sx={{":hover": { borderLeft: tabValue !== 0 ? "5px solid #2c2c2c" : ""}, transition: "all ease 0.2s", color: tabValue === 0 ? "white" : "", bgcolor: tabValue === 0 ? "#2c2c2c" : ""}}>
                <ListItemButton onClick={() => setTabValue(0)}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: tabValue !== 0 ? '#2C2C2C' : "white", color: tabValue === 0 ? "#2c2c2c" : ""}}>{data?.user.name.charAt(0).toUpperCase()}</Avatar>
                  <ListItemText primary="Profile" sx={{ ml: 4 }}/>
                </ListItemButton>
                { tabValue === 0 && <NavigateNextIcon/> }
              </ListItem>
              {[
                { text: 'Users', icon: <PeopleIcon />, index: 1 },
                { text: 'Departments', icon: <GroupsIcon />, index: 2 },
                { text: 'Bookings', icon: <LocalTaxiIcon />, index: 3 },
                { text: 'Dashboard', icon: <DashboardIcon />, index: 4},
                { text: 'Export Bookings', icon: <FileDownloadIcon />, index: 5 },
              ].map((item) => (
                <ListItem key={item.text} disablePadding sx={{ bgcolor: tabValue === item.index ? "#2c2c2c" : "", color: tabValue === item.index ? "white" : "", ":hover": { borderLeft: tabValue !== item.index ? "5px solid #2c2c2c" : "" }, transition: "all ease 0.2s"}}>
                  <ListItemButton onClick={() => setTabValue(item.index)}>
                    <ListItemIcon sx={{ color: tabValue === item.index ? "white" : "" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    { tabValue === item.index && <NavigateNextIcon/>}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <div className="w-full">
          {tabValue === 0 && <Profile/>}
          {tabValue === 1 && (
            <div>
              <UserManagePage departments={departments} />
            </div>
          )}

          {tabValue === 2 && (
            <div>
              <DepartmentManagePage />
            </div>
          )}
          {tabValue === 3 && (
            <div>
              <BookingManagePage />
            </div>
          )}
          {tabValue === 4 && <SuperDashboard />}
          {tabValue === 5 && <ExportPage />}
        </div>
      </div>

      {signOutDialogOpen && (
        <ConfirmDialog
          open={signOutDialogOpen}
          dialogTitle="Sign out confirmation"
          confirmMessage="Are you sure you want to sign out ?"
          confirmButtonText="Yes"
          cancelButtonText="No, cancel"
          confirmCallBack={handleSignOut}
          cancelCallBack={() => setSignOutDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Page;

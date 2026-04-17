"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { UserRecord } from "@/model/models";
import { USER_ROLE } from "@/model/models";
import SuperDashboard from "@/components/SuperDashboard";
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
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import { getDepartmentsList } from "./requests";
import DepartmentManagePage from "./departmentManageComponents/departmentManagePage";
import { UserManagePage } from "./userManageComponents/userManagePage";
import { BookingManagePage } from "./bookingManageComponents/bookingManagePage";
import ExportPage from "./exportManageComponents/export";
import ForbiddenPage from "@/components/ForbiddenPage";

const Page = () => {
  // Get NextAuth Session.
  const { status, data } = useSession();
  const [isForbidden, setIsForbidden] = useState(false);

  const router = useRouter();

  const [departments, setDepartments] = useState<UserRecord["department"][]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    } else if (data && data.user?.account_type !== USER_ROLE.SUPER_ADMIN) {
      // Only super admins can access this page, so if user is not super admin, set forbidden to true to show forbidden page.
      setIsForbidden(true);
    } else if (data && data.user?.account_type === USER_ROLE.SUPER_ADMIN) {
      setIsForbidden(false);
      getDepartmentsList().then(async res => {
        if (res.status === 200) {
          const data = await res.json();
          setDepartments(data);
        }
      });
    }
  }, [status, router]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const [tabValue, setTabValue] = useState(0);

  if (isForbidden) {
    return <ForbiddenPage />;
  }

  return (
    <div className="flex-col font-inter">
      <header className="w-full bg-[#2c2c2c] text-white p-3 shadow-lg items-center flex gap-4 sticky top-0 z-50">
        <Button
          onClick={toggleDrawer(true)}
          sx={{ color: "white", minWidth: '40px' }}
        >
          <MenuIcon fontSize="medium" />
        </Button>
        <span className="font-aleo text-2xl sm:text-3xl font-semibold">Management Panel</span>
      </header>

      <div className="w-full flex justify-center items-start p-4">
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', fontFamily: "aleo", fontSize: 25 }}>
              Admin Menu
            </Typography>
            <Divider />
            <List>
              {[
                { text: 'Users', icon: <PeopleIcon />, index: 0 },
                { text: 'Departments', icon: <GroupsIcon />, index: 1 },
                { text: 'Bookings', icon: <LocalTaxiIcon />, index: 2 },
                { text: 'Dashboard', icon: <DashboardIcon />, index: 3},
                { text: 'Export Bookings', icon: <FileDownloadIcon />, index: 4 },
              ].map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton onClick={() => setTabValue(item.index)}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      
      <div className="w-full">
        {tabValue === 0 && (
          <div>
            <UserManagePage departments={departments} />
          </div>
        )}

        {tabValue === 1 && (
          <div>
            <DepartmentManagePage />
          </div>
        )}
        {tabValue === 2 && (
          <div>
            <BookingManagePage />
          </div>
        )}
        {tabValue === 3 && <SuperDashboard/>}
        {tabValue === 4 && <ExportPage/>}
      </div>
      </div>
      </div>
  );
};

export default Page;

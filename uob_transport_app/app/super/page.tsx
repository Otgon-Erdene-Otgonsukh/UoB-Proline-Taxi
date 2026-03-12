"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserRecord } from "@/model/models";
import { motion } from "framer-motion";
import SuperDashboard from "@/components/SuperDashboard";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import { getDepartmentsList } from "./request";
import { UserManagePage } from "./userManageComponents/userManagePage";
import DepartmentManagePage from "./departmentManageComponents/departmentManagePage";

const Page = () => {
  // Get NextAuth Session.
  const { status } = useSession();

  const router = useRouter();

  const [departments, setDepartments] = useState<UserRecord["department"][]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    getDepartmentsList().then(async res => {
      if (res.status === 200) {
        const data = await res.json();
        setDepartments(data);
      }
    })
  }, [status, router,]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const [tabValue, setTabValue] = useState(0);

  return (
    <div className={`min-h-screen ${tabValue === 3 ? "-pt-25 md:-mt-2 mt-0 md:mb-0" : "pt-15 flex flex-col items-center p-4"}`}>
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
              { text: 'Dashboard', icon: <DashboardIcon />, index: 3 },
              { text: 'Export Bookings', icon: <FileDownloadIcon />, index: 4 },
              { text: 'Admin Settings', icon: <SettingsIcon />, index: 5 },
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

      <motion.div
        className={`bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-6xl mb-8 h-fit ${tabValue === 3 && "hidden"}`}
        initial={{ opacity: 0, y: 7, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.24 }}
      >
        {tabValue === 0 && (
          <div>
            <div className="flex items-center gap-2 -ml-2">
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  color: '#2c2c2c',
                  '&:hover': {
                    bgcolor: '#f3f4f6',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <h1 className="text-xl font-aleo md:text-3xl font-semibold text-shadow-lg/20">
                User Management
              </h1>
            </div>
            <UserManagePage departments={departments} />
          </div>
        )}

        {tabValue === 1 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  color: '#2c2c2c',
                  '&:hover': {
                    bgcolor: '#f3f4f6',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <h1 className="text-xl font-aleo md:text-3xl font-semibold text-shadow-lg/20">
                Departments
              </h1>
            </div>
            <DepartmentManagePage />
          </div>
        )}
      </motion.div>

      {tabValue === 3 && <SuperDashboard />}

    </div>
  );
};

export default Page;

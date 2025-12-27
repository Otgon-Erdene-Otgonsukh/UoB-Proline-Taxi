'use client';

import Link from "next/link";
import Image from "next/image";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react'
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const Navbar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const { data: session } = useSession();

  const handleLoginClick = () => {
    router.push("/login");
  }

  const pages = [
    { name: 'Home', path: '/home' },
    { name: 'Dashboard', path: '/dep-dashboard' },
    { name: 'About', path: '/about' },
    { name: 'Help', path: '/faq' },
  ];

  const isActive = (path: string) => {
    return currentPath === path;
  }

  // Dropdown menu when click on the welcome message
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [signoutDialogOpen, setSignoutDialogOpen] = useState(false)
  const handleOpenSiagnoutDialog = () => {
    setSignoutDialogOpen(true)
  }
  const handleCloseSignoutDialog = () => {
    setSignoutDialogOpen(false)
  }
  const handleSignout = () => {

  }

  return (
    <nav className="bg-[#2C2C2C] text-white w-full p-6 sm:p-4 md:justify-start">
      <div className="flex justify-between items-center">
        {/* logos */}
        <div className="flex items-center space-x-4">
          <Link href={"/"}>
            <Image
              width={240}
              height={26}
              src={"/ownlogo.png"}
              alt="Company Logo"
            />
          </Link>

          <div className="h-12 w-[0.5px] bg-gradient-to-b via-gray-300"></div>

          <Link href={"https://www.bristol.ac.uk/"}>
            <Image
              className="mix-blend-lighten"
              width={110}
              height={26}
              src={"/whiteuni.svg"}
              alt="Company Logo"
              unoptimized
            />
          </Link>

          <div className="h-12 w-px bg-gradient-to-b via-gray-300"></div>

          <Link href={"https://prolinetaxi.com/"}>
            <Image
              width={100}
              height={26}
              src={"/Union.png"}
              alt="Company Logo"
            />
          </Link>
        </div>
        {/* Links */}
        <ul className="hidden lg:flex lg:items-center gap-12">
          {pages.map((page, index) => (
            <li key={index}>
              <Link
                href={page.path}
                className={"text-lg hover:text-gray-300 relative group flex items-center gap-2"}
              >
                <Image src={`${index === 0 ? "/Home-cropped.svg" : index === 1 ? "/dashboard.svg" : index === 2 ? "/Info.svg" : "/help.svg"}`} className={`${(index === 1 || index === 0) && "mb-1 w-[14px] h-[14px]"}`} width={15} height={15} alt="Tab logos"></Image>
                {page.name}
                <span className={`absolute -bottom-0.5 left-1/2 h-0.5 bg-white transition-all duration-300 transform -translate-x-1/2 ${isActive(page.path) ? 'w-full' : 'w-0 group-hover:w-full group-hover:bg-gray-300'}`}></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="pr-6">
          {session ? (
            <div>
              <Button className="text-lg" onClick={handleClick}>Hi, {session.user?.name}!</Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleCloseMenu}>
                  <Avatar />
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleOpenSiagnoutDialog}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
              <Dialog
                open={signoutDialogOpen}
                onClose={handleCloseSignoutDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Sign out confirmation"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to sign out?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseSignoutDialog}>Cancel</Button>
                  <Button onClick={handleSignout} autoFocus>Yes</Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : (
            <Button variant="contained" onClick={handleLoginClick}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                '&:hover': {
                  backgroundColor: '#d1d5db',
                },
              }}
            >
              Login
            </Button>)}
        </div>
      </div>
    </nav>
  );
};

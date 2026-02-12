'use client';

import Link from "next/link";
import Image from "next/image";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react'
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export const Navbar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const { data: session } = useSession();

  const handleLoginClick = () => {
    router.push("/login");
  }

  const pages = [
    { name: 'Home', path: '/home', icon: <HomeOutlinedIcon /> },
    { name: 'Dashboard', path: '/dep-dashboard', icon: <DashboardOutlinedIcon /> },
    { name: 'About', path: '/about', icon: <InfoOutlinedIcon /> },
    { name: 'Help', path: '/faq', icon: <HelpCenterOutlinedIcon /> },
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
    signOut({ callbackUrl: '/' })
  }

  const [navAnchorEl, setNavAnchorEl] = useState<null | HTMLElement>(null);
  const navOpen = Boolean(navAnchorEl);

  const handleOpenNav = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNavAnchorEl(event.currentTarget);
  };

  const handleCloseNav = () => {
    setNavAnchorEl(null);
  };

  return (
    <nav className="bg-[#2C2C2C] text-white w-full p-3 md:p-5">
      <div className="flex justify-between items-center">
        {/* logos */}
        <div className="h-10 flex items-center space-x-2">
          <Link href={"/"}>
            <Image
              width={240}
              height={26}
              src={"/ownlogo.png"}
              alt="Company Logo"
            />
          </Link>

          <div className="hidden xl:flex h-12 w-[0.5px] bg-gradient-to-b via-gray-300"></div>

          <Link href={"https://www.bristol.ac.uk/"} className="hidden xl:flex">
            <Image
              className="mix-blend-lighten"
              width={110}
              height={26}
              src={"/whiteuni.svg"}
              alt="Company Logo"
              unoptimized
            />
          </Link>

          <div className="hidden xl:flex h-12 w-px bg-gradient-to-b via-gray-300"></div>

          <Link href={"https://prolinetaxi.com/"} className="hidden xl:flex">
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
                {page.icon}
                {page.name}
                <span className={`absolute -bottom-0.5 left-1/2 h-0.5 bg-white transition-all duration-300 transform -translate-x-1/2 ${isActive(page.path) ? 'w-full' : 'w-0 group-hover:w-full group-hover:bg-gray-300'}`}></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="pr-6 flex items-center gap-3">
          {/* Hamburger :) */}
          <div className="lg:hidden">
            <Button
              onClick={handleOpenNav}
              sx={{ color: "white", minWidth: '40px' }}
            >
              <MenuIcon fontSize="medium" />
            </Button>
            <Menu
              anchorEl={navAnchorEl}
              open={navOpen}
              onClose={handleCloseNav}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))',
                    mt: 2.5,
                    borderRadius: 2,
                    border: '2px solid black',
                    '& .MuiList-root': {
                      paddingTop: 0,
                      paddingBottom: 0,
                    },
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {pages.map((page, index) => (
                <MenuItem
                  key={index}
                  onClick={() => { router.push(page.path); handleCloseNav(); }}
                  sx={{
                    fontWeight: isActive(page.path) ? 700 : 400,
                    color: '#2C2C2C'
                  }}
                >
                  {page.icon}
                  <div className="p-2">{page.name}</div>
                </MenuItem>
              ))}

              {session && (
                <div>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    onClick={handleCloseNav}
                    sx={{ color: '#2C2C2C' }}
                  >
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: '#2C2C2C' }}>
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="p-2">Profile</div>
                  </MenuItem>
                  <MenuItem
                    onClick={() => { handleCloseNav(); handleOpenSiagnoutDialog(); }}
                    sx={{ color: '#d32f2f' }}
                  >
                    <Logout sx={{ fontSize: 24 }} />
                    <div className="p-2">Logout</div>
                  </MenuItem>
                </div>
              )}
            </Menu>
          </div>
          {session ? (
            <div>
              <Button className="text-lg" sx={{ color: "white", fontFamily: "inter" }} onClick={handleClick}>Hi, {session.user?.name.split(" ")[0]}! <ArrowDropDownIcon sx={{ mb: 0.4, transform: open ? "rotate(180deg)" : "none" }} /></Button>
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
                      filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))',
                      mt: 2.5,
                      minWidth: 150,
                      borderRadius: 2,
                      bgcolor: '#ffffff',
                      border: '2px solid black',
                      '& .MuiList-root': {
                        paddingTop: 1,
                        paddingBottom: 1,
                      },
                      '& .MuiAvatar-root': {
                        width: 36,
                        height: 36,
                        ml: -0.5,
                        mr: 1.5,
                        bgcolor: '#2C2C2C',
                        fontSize: '0.95rem',
                      },
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.5,
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: '#f5f5f5',
                          transform: 'translateY(-3px)',
                        },
                      },
                      '& .MuiListItemIcon-root': {
                        minWidth: 36,
                        color: '#666',
                      },
                      '& .MuiDivider-root': {
                        my: 1,
                        borderColor: 'rgba(0,0,0,0.08)',
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 12,
                        height: 12,
                        bgcolor: '#ffffff',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        border: '1px solid rgba(0,0,0,0.05)',
                        borderRight: 'none',
                        borderBottom: 'none',
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => {handleCloseMenu(); router.push("/profile")}}
                  sx={{
                    fontWeight: 500,
                    color: '#2C2C2C',
                  }}
                >
                  <Avatar>{session?.user?.name?.charAt(0).toUpperCase()}</Avatar>
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={handleOpenSiagnoutDialog}
                  sx={{
                    color: '#d32f2f',
                    '&:hover': {
                      bgcolor: '#ffebee !important',
                    }
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: '#d32f2f', ml: 0.5 }} />
                  </ListItemIcon>
                  <p className="ml-1">Logout</p>
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

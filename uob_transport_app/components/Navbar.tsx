'use client';

import Link from "next/link";
import Image from "next/image";
import Button from '@mui/material/Button';
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

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
              className={"text-lg hover:text-gray-300 relative group"}
            >
              {page.name}
              <span className={`absolute -bottom-0.5 left-1/2 h-0.5 bg-white transition-all duration-300 transform -translate-x-1/2 ${isActive(page.path) ? 'w-full' : 'w-0 group-hover:w-full group-hover:bg-gray-300'}`}></span>
            </Link>
          </li>
        ))}
      </ul>
        <div className="pr-6">
          {session ? (
            <span className="text-lg">Hi, {session.user.name}!</span>
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

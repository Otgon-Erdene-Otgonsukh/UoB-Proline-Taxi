import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
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
        <ul className="hidden lg:flex lg:items-center gap-9">
          <li>
            <Link
              href={"/"}
              className="flex items-center gap-1 text-lg hover:text-gray-300 relative group"
            >
              <img src="/Home.svg" className="mt-1.5"></img>
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link
              href={"/Dashboard"}
              className="flex items-center gap-2 text-lg hover:text-gray-300 relative group"
            >
              <img src="/dashboard.svg" className="-mt-1"></img>
              <span>Dashboard</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link
              href={"/about"}
              className="flex items-center gap-2 text-lg hover:text-gray-300 relative group"
            >
              <img src="/Info.svg" width={17}></img>
              <span>About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link
              href={"/faq"}
              className="flex items-center gap-2 text-lg hover:text-gray-300 relative group"
            >
              <img src="/help.svg"></img>
              <span>Help</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        </ul>
        <div>
          <Image
            className="h-11 w-11 rounded-full"
            width={340}
            height={340}
            src={"/no-pfp-found.jpg"}
            alt="profile picture"
          />
        </div>
      </div>
    </nav>
  );
};

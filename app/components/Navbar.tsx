import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
    return (
        <nav className= "bg-[#2C2C2C] text-white w-full p-4 sm:p-6 md:justify-start drop-shadow-xl drop-shadow-[#2C2C2C]">
            <div className="flex justify-between items-center">
                {/* logos */}
                <div className="flex items-center space-x-4">
                    <Link href={"/"}>

                        <Image className="h-10 w-auto"
                        width={61}
                        height={26}
                        src={"/placeholder-logo.png"}
                        alt="Company Logo"
                        />

                    </Link>

                    <div className="h-12 w-px 2xl:w-0.5 bg-gradient-to-b via-gray-300"></div>
                    
                    <Link href={"https://www.bristol.ac.uk/"}>

                        <Image className="h-10 w-auto"
                        width={61}
                        height={26}
                        src={"/uob-logo.svg"}
                        alt="Company Logo"
                        unoptimized
                        />

                    </Link>
                    
                    <div className="h-12 w-px 2xl:w-0.5 bg-gradient-to-b via-gray-300"></div>
                    
                    <Link href={"https://prolinetaxi.com/"}>

                        <Image className="h-10 w-auto"
                        width={61}
                        height={26}
                        src={"/placeholder-logo.png"}
                        alt="Company Logo"
                        />

                    </Link>
                </div>
                {/* Links */}
                <ul className="hidden sm:flex">
                    <Link href={"/"} className="mr-10 text-xl hover:text-gray-300 hover:border-b-1">Home</Link>
                    
                    <Link href={"/Dashboard"} className="mr-10 text-xl hover:text-gray-300 hover:border-b-1">Dashbard</Link>
                    
                    <Link href={"/About"} className="mr-10 text-xl hover:text-gray-300 hover:border-b-1">About</Link>
                    
                    <Link href={"/Help"} className="mr-10 text-xl hover:text-gray-300 hover:border-b-1">Help</Link>
                </ul>
                <div>
                    <Image
                    className="h-11 w-11 rounded-full"
                    width={340}
                    height={340}
                    src={"/no-pfp-found.jpg"}
                    alt="profile picture"/>

                </div>
            </div>
        </nav>
    );

}
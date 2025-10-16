import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
    return (
        <nav className="bg-[#2C2C2C] text-white p-4 sm:p-6 md:flex md:justify-start">
            <div className="w-full flex justify-between items-center">
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
                <div className="md:flex flex-1 items-center justify-evenly">
                    <Link href={"/"} className="mx-2 hover:text-gray-300">Home</Link>
                    
                    <Link href={"/Dashbard"} className="mx-2 hover:text-gray-300">Dashbard</Link>
                    
                    <Link href={"/About"} className="mx-2 hover:text-gray-300">About</Link>
                    
                    <Link href={"/Help"} className="mx-2 hover:text-gray-300">Help</Link>
                </div>
            </div>
        </nav>
    );

}
import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="bg-[#2C2C2C] text-white p-4 sm:p-6 md:flex md:justify-between">
            <div className="container mx-auto flex justify-between items-center">
                <Link href={"/"}>

                //logo
                
                </Link>
                <Link href={"/"} className="mx-2 hover:text-gray-300">Home</Link>
                
                <Link href={"/Dashbard"} className="mx-2 hover:text-gray-400">Dashbard</Link>
                
                <Link href={"/About"} className="mx-2 hover:text-gray-400">About</Link>
                
                <Link href={"/Help"} className="mx-2 hover:text-gray-400">Help</Link>
            </div>
        </nav>
    );

}
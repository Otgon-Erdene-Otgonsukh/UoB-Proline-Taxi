import Link from "next/link";

export function Landing_page() {
  return (
    <div>
      <div className="flex flex-col mt-12 mb-8 lg:flex-row min-h-screen justify-evenly items-center px-4 py-8 lg:py-0">
        {/*the image and the h1 dynamically shrinks and expand based on the screen size using lg sm tailwind properties*/}
        <img
          className="w-64 h-64 mt-14 sm:w-80 sm:h-80 lg:w-100 lg:h-100 lg:order-2 lg:mr-12 mb-8 lg:mb-0"
          src={"/landpic.svg"}
          alt="Landing"
        />
        <div className="lg:order-1 text-center lg:text-left">
          <h1 className="font-aleo font-light text-2xl sm:text-3xl lg:text-4xl text-shadow-lg/20 lg:ml-6 lg:mt-20 px-4 lg:px-0">
            From <strong>quick</strong> campus rides to <br /> professional{" "}
            <strong>chauffeur</strong> journeys,
            <br /> make every trip smooth, safe, and <br /> comfortable with{" "}
            <strong>Proline Taxi</strong>.
          </h1>
          <div className="mt-8 lg:ml-6 flex flex-col lg:flex-row gap-4 max-w-md mx-auto lg:mx-5">
            <Link href="/login">
              <button
                type="button"
                className="w-full lg:w-auto border-[#2c2c2c] border-1 bg-[#2c2c2c] text-white font-inter font-light rounded-md py-3 px-11 text-sm cursor-pointer hover:scale-101 active:bg-[#4d4d4d] whitespace-nowrap"
              >
                LOGIN TO BOOK NOW
              </button>
            </Link>
            <Link href="/">
              <button
                type="button"
                className="w-full lg:w-auto border-1 text-[#303030] font-inter font-medium rounded-md py-3 px-20 text-sm cursor-pointer hover:scale-101 whitespace-nowrap active:bg-[#efefef]"
              >
                MORE INFO
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing_page;

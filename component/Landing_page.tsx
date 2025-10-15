import Link from "next/link";

export function Landing_page() {
  return (
    <div>
      <div className="flex min-h-screen justify-evenly items-center">
        <div>
          <h1 className="font-aleo font-light text-4xl text-shadow-lg/20 ml-6 mt-20">
            From <strong>quick</strong> campus rides to <br /> professional{" "}
            <strong>chauffeur</strong> journeys,
            <br /> make every trip smooth, safe, and <br /> comfortable with{" "}
            <strong>Proline Taxi</strong>.
          </h1>
          <div className="mt-8 ml-6 flex flex-col lg:flex-row gap-4">
            <Link href="/login">
              <button
                type="button"
                className=" border-[#2c2c2c] border-1 bg-[#2c2c2c] text-white font-inter font-light rounded-md py-3 px-11 text-sm cursor-pointer hover:scale-101 active:bg-[#4d4d4d]"
              >
                LOGIN TO BOOK NOW
              </button>
            </Link>
            <Link href="/">
              <button
                type="button"
                className=" border-1 text-[#303030] font-inter font-medium rounded-md py-3 px-20 text-sm cursor-pointer hover:scale-101"
              >
                MORE INFO
              </button>
            </Link>
          </div>
        </div>
        <img
          className=" w-100 h-100 mr-12 mt-20"
          src={"/landpic.svg"}
          alt="Landing"
        />
      </div>
    </div>
  );
}

export default Landing_page;

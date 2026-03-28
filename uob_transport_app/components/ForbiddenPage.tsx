import Image from "next/image";

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center font-inter p-4">
      <Image
        src="/403.png"
        width="400"
        height="50"
        className="mix-blend-darken shrink-0 mb-5 grayscale-100 md:w-100 w-70"
        alt="403 Forbidden error image"
      />
      <h1 className="font-aleo font-bold md:text-4xl text-3xl">
        Access Denied
      </h1>
      <h2 className="font-aleo md:text-xl text-lg mt-4">
        Sorry, you are not authorized to access this page.
      </h2>
    </div>
  );
}

export default ForbiddenPage;

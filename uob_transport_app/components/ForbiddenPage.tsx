import Image from "next/image";

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center font-inter p-4">
      <Image
        src="/403.png"
        width="400"
        height="50"
        className="mix-blend-darken shrink-0 mb-5"
        alt="403 Forbidden error image"
      />
      <h1 className="font-aleo font-bold text-4xl">
        Access Denied
      </h1>
      <h2 className="font-aleo text-xl mt-4">
        Sorry, you are not authorized to access this page.
      </h2>
    </div>
  );
}

export default ForbiddenPage;

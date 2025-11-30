"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const uuid = searchParams.get('uuid')

  console.log(uuid);


  useEffect(() => {

    // get user detail by uuid

  }, []);

  return (<h1>abc</h1>)

}

export default Page;

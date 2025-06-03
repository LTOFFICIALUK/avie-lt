"use client";
import LandingPage from "@/components/landing/LandingPage";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { lang } = useParams();

  useEffect(() => {
    if (localStorage.getItem("jwt_token")) {
      router.push(`/${lang}`);
    }
  }, []);

  return (
    <LandingPage />);
};

export default Page;

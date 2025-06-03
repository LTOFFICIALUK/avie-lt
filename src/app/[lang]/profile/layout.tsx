"use client";
import React from "react";
import ProfileLayout from "./(components)/ProfileLayout";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return <ProfileLayout>{children}</ProfileLayout>;
};

export default Layout;

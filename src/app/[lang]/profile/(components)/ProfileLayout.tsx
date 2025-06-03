"use client";
import TabSubmenu from "@/components/menus/TabSubmenu";
import api from "@/lib/api";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProfileCard from "../(components)/ProfileCard";
import { Profile } from "@/types/api";
import { LoadingOutlined } from "@ant-design/icons";
import { useSession } from "@/providers/SessionProvider";

interface Props {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: Props) => {
  const pathname = usePathname();
  const params = useParams();
  const { user } = useSession();
  const locale = params?.lang as string;

  // Get username from URL params or fallback to logged-in user
  const username =
    (params?.username as string) || user?.displayName || undefined;
  const basePath = pathname.split("/").slice(0, 3).join("/");

  const navigation = [
    {
      name: "Profile",
      href: `${basePath}${params?.username ? `/${params.username}` : ""}`,
    },
    {
      name: "Videos",
      href: `${basePath}${
        params?.username ? `/${params.username}` : ""
      }/videos`,
    },
    {
      name: "About",
      href: `${basePath}${params?.username ? `/${params.username}` : ""}/about`,
    },
    {
      name: "Followers",
      href: `${basePath}${
        params?.username ? `/${params.username}` : ""
      }/followers`,
    },
  ];

  const [loadingProfileData, setIsLoadingProfileData] = useState(false);
  const [profileData, setProfileData] = useState<Profile | undefined>();
  const [error, setError] = useState("");

  const fetchProfileData = async () => {
    if (!username) return;

    try {
      setIsLoadingProfileData(true);
      const response = await api.get(`/api/profile/${username}`);

      if (response.data.status === "success" && response.data.data) {
        setProfileData(response.data.data);
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setIsLoadingProfileData(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  return (
    <>
      {profileData && !loadingProfileData && (
        <ProfileCard profileData={profileData} lang={locale} />
      )}
      <TabSubmenu navigation={navigation}>{children}</TabSubmenu>
    </>
  );
};

export default ProfileLayout;

import { Profile } from "@/types/api";
import { CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Progress, Tooltip } from "antd";
import React from "react";
import { useSession } from "@/providers/SessionProvider";

interface Props {
  profileData: Profile;
  lang: string;
}

const ProfileCard = ({ profileData, lang }: Props) => {
  const { user } = useSession();
  const isOwnProfile = user?.displayName === profileData.displayName;

  const formatNumber = (number: number): string => {
    if (number > 1000000) return (number / 1000000).toString() + "mil";
    else if (number > 1000) return (number / 1000).toString() + "k";
    else return number.toString();
  };

  const getHealthColor = (score: number) => {
    if (score <= 30) return "#ff4d4f"; // red
    if (score <= 70) return "#faad14"; // orange
    return "#52c41a"; // green
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 pb-8 sm:pb-12 w-full">
      <div className="relative flex-shrink-0 w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] rounded-full overflow-hidden flex items-center justify-center bg-gray-800 mx-auto sm:mx-0">
        {profileData.avatarUrl ? (
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={profileData.avatarUrl}
            alt="Avatar"
            style={{
              minWidth: '100%',
              minHeight: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        ) : (
          <UserOutlined className="text-gray-400" style={{ fontSize: "60px" }} />
        )}
      </div>
      <div className="flex flex-col w-full gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex gap-3 sm:gap-5 items-baseline">
              <h2 className="text-white !text-xl sm:!text-2xl font-semibold">
                @{profileData.displayName}
              </h2>
              {profileData.isVerified && (
                <CheckCircleOutlined style={{ color: "var(--color-brand)" }} />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                Account Health:
              </span>
              <Tooltip
                title={capitalizeFirstLetter(profileData.accountHealth.status)}
              >
                <div className="w-[100px] max-w-[50px]">
                  <Progress
                    percent={profileData.accountHealth.score}
                    size="small"
                    strokeColor={getHealthColor(
                      profileData.accountHealth.score
                    )}
                    showInfo={false}
                    strokeWidth={8}
                    className="!min-w-0"
                  />
                </div>
              </Tooltip>
            </div>
            <div className="text-base sm:text-lg flex flex-wrap justify-center sm:justify-start gap-2 items-center text-[var(--text-secondary)]">
              <p>{formatNumber(profileData.stats.followers)} followers</p>
              <div className="h-2 w-2 rounded-full inline bg-[var(--text-secondary)]"></div>
              <p>{formatNumber(profileData.stats.following)} following</p>
              <div className="h-2 w-2 rounded-full inline bg-[var(--text-secondary)]"></div>
              <p>{formatNumber(profileData.stats.videos)} videos</p>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            {profileData.socials.map((social) => (
              <>icon</>
            ))}
          </div>
        </div>
        <p className="text-white text-center sm:text-left">{profileData.bio}</p>
        {isOwnProfile && (
          <div className="flex gap-2 justify-center sm:justify-start">
            <Button type="primary">Go Live</Button>
            <Button href={`/${lang}/dashboard/settings`}>Edit Profile</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;

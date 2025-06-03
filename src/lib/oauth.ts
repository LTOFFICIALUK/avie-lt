export const connectDiscord = () => {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/discord/callback`;
  const scope = 'identify email';

  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;

  window.location.href = url;
};

export const connectTwitch = () => {
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/twitch/callback`;
  const scope = 'user:read:email chat:read chat:edit';

  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;

  window.location.href = url;
}; 
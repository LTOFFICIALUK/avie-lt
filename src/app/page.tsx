import { redirect } from "next/navigation";

// Default locale
const defaultLocale = "en";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}

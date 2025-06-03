"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { useSession } from "@/providers/SessionProvider";
import { AxiosError } from "axios";

const protectedPaths = ["dashboard", "profile", "settings", "streams", "chat"];
const AUTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface ApiErrorResponse {
  status?: number;
  data?: {
    message?: string;
  };
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { refresh, isAuthenticated, isLoading } = useSession();
  const lastCheckRef = useRef<number>(0);

  useEffect(() => {
    const checkAuth = async () => {
      if (!pathname || isLoading) return;

      const token = localStorage.getItem("jwt_token");
      const requiresAuth = protectedPaths.some((path) =>
        pathname.includes(path)
      );
      const now = Date.now();

      if (requiresAuth) {
        if (!token || !isAuthenticated) {
          console.log("Auth required but not authenticated:", pathname);

          // Extract language from the path
          const pathParts = pathname.split("/").filter(Boolean);
          const lang = pathParts[0]; // First part should be the language code

          router.push(`/${lang}/landing`);
          return;
        }

        // Check only if enough time has passed since the last check
        if (now - lastCheckRef.current > AUTH_CHECK_INTERVAL) {
          try {
            await api.get("/api/user/profile");
            await refresh();
            lastCheckRef.current = now;
          } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            if (
              axiosError.response?.status === 401 ||
              axiosError.response?.status === 403
            ) {
              console.error("Auth check failed:", axiosError);

              // Extract language from the path for error redirection
              const pathParts = pathname.split("/").filter(Boolean);
              const lang = pathParts[0];

              router.push(`/${lang}/landing`);
            }
          }
        }
      }
    };

    checkAuth();
  }, [pathname, router, refresh, isAuthenticated, isLoading]);

  // Show nothing while checking auth
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

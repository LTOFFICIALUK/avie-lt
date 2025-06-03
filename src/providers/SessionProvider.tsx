"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Session } from "@/types/session";
import { getToken, removeToken } from "@/lib/auth";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  status?: number;
  data?: {
    message?: string;
  };
}

interface SessionContextType extends Session {
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refresh: async () => {},
  logout: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refresh = async () => {
    try {
      const token = getToken();

      if (!token) {
        setSession((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
          isAuthenticated: false,
        }));
        return;
      }

      const response = await api.get("/api/user/profile");

      if (response.data) {
        setSession({
          user: response.data,
          isLoading: false,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        console.error("Session refresh error:", axiosError);
        removeToken();
        setSession({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/user/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeToken();
      setSession({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      window.location.href = "/en";
    }
  };

  useEffect(() => {
    refresh();

    const handleAuthChange = () => {
      console.log("Auth change detected");
      refresh();
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  return (
    <SessionContext.Provider value={{ ...session, refresh, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);

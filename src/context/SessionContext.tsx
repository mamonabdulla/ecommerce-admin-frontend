"use client";

import {
  createContext,
  useContext,
} from "react";

export interface SessionData {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;

  role: string | null;

  permissions: string[];
}

export const SessionContext =
  createContext<SessionData | null>(
    null,
  );

export function useSession() {
  return useContext(SessionContext);
}
// lib/withAuthResepsionis.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from "react";

// Constrain P to allow JSX attributes
export function withAuthResepsionis<P extends Record<string, any>>(Component: React.ComponentType<P>): React.FC<P> {
  const Protected: React.FC<P> = (props) => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.replace("/login");
      }
    }, [status, router]);

    if (status !== "authenticated") {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Memeriksa otentikasi...</p>
        </div>
      );
    }

    return <Component {...props} />;
  };

  return Protected;
}
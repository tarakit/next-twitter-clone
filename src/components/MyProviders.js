import { SessionProvider } from "next-auth/react";
import React from "react";
import { RecoilRoot } from "recoil";

export default function MyProviders({ children, session }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>{children}</RecoilRoot>
    </SessionProvider>
  );
}

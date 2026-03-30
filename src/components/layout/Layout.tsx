import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = ({ children, hideFooter }: { children: React.ReactNode; hideFooter?: boolean }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;

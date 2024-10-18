
import type { Metadata } from "next";
import "./globals.css";
import ChildLayout from "./components/childLayout";

export const metadata: Metadata = {
  title: "Resume Web App",
  description: "Created by Aviroez",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <ChildLayout>
          {children}
        </ChildLayout>      
      </body>
    </html>
  );
}

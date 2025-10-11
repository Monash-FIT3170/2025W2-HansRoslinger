import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections - Hans Roslinger",
  description: "Manage your collections of uploads",
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
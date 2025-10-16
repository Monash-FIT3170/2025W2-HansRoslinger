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
  // Ensure vertical scrolling for the collections page
  return (
    <div className="flex flex-col min-h-screen w-full overflow-y-auto">
      {children}
    </div>
  );
}

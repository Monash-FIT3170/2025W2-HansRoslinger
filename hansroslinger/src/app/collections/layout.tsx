"use client";

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure vertical scrolling for the collections page
  return (
    <main className="flex-1 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FC] via-[#5C9BB8]/8 to-[#E8F0F7]/12 -z-10"></div>
      <div className="flex flex-col w-full overflow-y-auto">
        {children}
      </div>
    </main>
  );
}

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t text-center p-4 text-sm text-gray-500 z-50">
        © {new Date().getFullYear()} Mystery Message. All rights reserved.
      </footer>
    </>
  );
}

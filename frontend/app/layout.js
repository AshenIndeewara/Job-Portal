import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto p-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
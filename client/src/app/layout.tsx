import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SGU Usuarios",
  description: "Gestión de usuarios"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-100 text-slate-900">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "AutomateRiz — AI Automation Services",
    template: "%s | AutomateRiz",
  },
  description:
    "We build intelligent automation systems that save time, reduce errors, and scale your operations. Training & custom automation solutions.",
  keywords: [
    "AI automation",
    "business automation",
    "n8n",
    "Make",
    "workflow automation",
    "training",
    "AutomateRiz",
  ],
  openGraph: {
    title: "AutomateRiz — AI Automation Services",
    description:
      "Automate Your Business. Faster. Smarter. Training & custom automation solutions.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('automateriz_theme');
                if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', t);
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

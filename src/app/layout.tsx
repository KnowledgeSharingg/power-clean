import "@/styles/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Power Clean - Book Sharing</title>
        <meta
          name="description"
          content="A platform to share and discuss book information."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-white text-black">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="site-container flex-1 w-full py-8 sm:py-10 lg:py-12">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

import "./globals.css";
import Header from "../components/Header";
import Topbar from "../components/Topbar";
import PlayerBar from "../components/PlayerBar";

export const metadata = {
  title: "Reach 2 — The Independent Music Platform",
  description: "Настоящие рецензии на независимую музыку. Оценивай, пиши, следи за вкусом друзей.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app">
          <Header />
          <main className="main">
            <Topbar />
            {children}
          </main>
        </div>
        <PlayerBar />
      </body>
    </html>
  );
}

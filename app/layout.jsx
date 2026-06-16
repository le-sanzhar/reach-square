import "./globals.css";
import Header from "../components/Header";
import Topbar from "../components/Topbar";
import PlayerBar from "../components/PlayerBar";
import BottomNav from "../components/BottomNav";
import AuthProvider from "../components/AuthProvider";

export const metadata = {
  title: "Reach 2 — The Independent Music Platform",
  description: "Настоящие рецензии на независимую музыку. Оценивай, пиши, следи за вкусом друзей.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#08080a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Перейти к контенту</a>
        <AuthProvider>
          <div className="app">
            <Header />
            <main className="main" id="main-content">
              <Topbar />
              {children}
            </main>
          </div>
          <PlayerBar />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}

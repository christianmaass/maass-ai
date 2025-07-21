import React from "react";

import MainAppHeader from "../components/MainAppHeader";
import Footer from "../components/Footer"; // Footer jetzt aus components

const MainApp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f8fa]">
      <MainAppHeader onLogout={() => { /* Logout-Logik hier implementieren */ }} />
      <main className="flex flex-1 flex-col items-center justify-center">
        <h1>Willkommen in der Hauptanwendung!</h1>
        <p>Du bist jetzt eingeloggt und siehst die geschützte Hauptseite.</p>
        {/* Hier kommen deine App-Komponenten hin */}
      </main>
      <Footer />
    </div>
  );
};

export default MainApp;

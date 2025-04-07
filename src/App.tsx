import { BrowserRouter, Routes, Route } from "react-router";

import { LendingPlatformSelectPage } from "@/pages/LendingPlatformSelectPage";
import { LendingPage } from "@/pages/LendingPage";
import { Header } from "@/components/Header";

import { WalletProvider } from "./providers/WalletProvider";

function App() {
  return (
    <main className="bg-[rgb(24,28,31)] mx-auto  h-screen">
      <WalletProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<LendingPlatformSelectPage />} />
            <Route path="/lending/:section" element={<LendingPage />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </main>
  );
}

export default App;

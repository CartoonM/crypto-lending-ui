import { useNavigate } from "react-router";

import { WalletConnector } from "../WalletConnector";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-900 p-4">
      <div
        className="text-2xl font-bold text-white cursor-pointer text-center sm:text-left mb-4 sm:mb-0"
        onClick={() => navigate("/")}
      >
        DeFi
      </div>

      <WalletConnector />
    </header>
  );
};

interface BalanceCardProps {
  shareAssetBalance: number | string;
  shareAssetSymbol: string;
  underlyingSymbol: string;
  underlyingAssetBalance: number | string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  shareAssetBalance,
  shareAssetSymbol,
  underlyingSymbol,
  underlyingAssetBalance,
}) => {
  return (
    <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
      <div className="flex justify-between">
        <span className="text-gray-400">Balance:</span>
        <span className="font-medium text-white">
          {shareAssetBalance} {shareAssetSymbol}
        </span>
      </div>
      <div className="mt-2 flex justify-between">
        <span className="text-gray-400">Available for withdrawal:</span>
        <span className="font-medium text-white">
          {underlyingAssetBalance} {underlyingSymbol}
        </span>
      </div>
    </div>
  );
};

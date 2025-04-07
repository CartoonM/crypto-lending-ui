import { useEffect, useState, useId } from "react";
import { formatUnits, parseUnits } from "ethers";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { BalanceCard } from "@/components/BalanceCard";
import { Dialog } from "@/components/Dialog";
import type { LendingContractWrapper } from "@/lendingContractWrappers";
import { useWallet } from "@/providers/WalletProvider";
import { useLoadingWrapper } from "@/hooks/useLoadingWrapper";
import {
  tryCatchAsync,
  isValidNumberString,
  toTruncatedDecimal,
} from "@/utils";

interface LendingCardProps {
  contract: LendingContractWrapper;
  fullWidth?: boolean;
}

type Asset = {
  symbol: string;
  address: string;
  decimals: number;
  balance: bigint;
};

const formatAssetBalance = (asset?: Pick<Asset, "balance" | "decimals">) => {
  if (!asset) return "0.0";

  return toTruncatedDecimal(asset.balance, asset.decimals, 4);
};

export const LendingCard: React.FC<LendingCardProps> = ({
  contract,
  fullWidth,
}) => {
  const { address, provider, signer } = useWallet();

  const [isErrorWithdrawDialogOpen, setIsErrorWithdrawDialogOpen] =
    useState(false);

  const [assets, setAssets] = useState<{
    underlying: Asset;
    share: Asset;
  } | null>(null);

  const [withdrawAmount, setWithdrawAmount] = useState<{
    amount?: bigint;
    displayAmount: string;
  } | null>(null);

  const formId = useId();

  const [isLoadingAssets, loadAssets] = useLoadingWrapper(
    async (address: string) => {
      setAssets({
        underlying: {
          symbol: await contract.getUnderlyingAssetSymbol(),
          address: await contract.getUnderlyingAssetAddress(),
          balance: await contract.getUnderlyingAssetBalance(address),
          decimals: Number(await contract.getUnderlyingAssetDecimals()),
        },
        share: {
          symbol: await contract.getShareAssetSymbol(),
          address: await contract.getUnderlyingAssetAddress(),
          balance: await contract.getShareAssetBalance(address),
          decimals: Number(await contract.getShareAssetDecimals()),
        },
      });
    }
  );

  useEffect(() => {
    if (!address || !contract || !provider) {
      return;
    }

    tryCatchAsync(() => loadAssets(address), console.error);
  }, [address, contract, provider]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidNumberString(value)) {
      setWithdrawAmount({
        displayAmount: value,
      });
    }
  };

  const handleMaxClick = () => {
    if (!assets) return;

    setWithdrawAmount({
      amount: assets.underlying.balance,
      displayAmount: formatUnits(
        assets.underlying.balance,
        assets.underlying.decimals
      ),
    });
  };

  const getWithdrawAmount = () => {
    if (!assets) return null;

    try {
      return (
        withdrawAmount?.amount ||
        parseUnits(
          withdrawAmount?.displayAmount ?? "0",
          assets.underlying.decimals
        )
      );
    } catch {
      return null;
    }
  };

  const [isWithdrawLoading, handleWithdraw] = useLoadingWrapper(async () => {
    if (!assets || !address || !signer) return;

    const amount = getWithdrawAmount();
    if (!amount) return;

    try {
      const txHash = await contract.withdraw(amount, address, address);
      await provider?.waitForTransaction(txHash);

      await loadAssets(address);
      setWithdrawAmount(null);
    } catch (e) {
      console.error("Withdraw error:", e);
      setIsErrorWithdrawDialogOpen(true);
    }
  });

  const isWithdrawAmountValid = () => {
    const amount = getWithdrawAmount();
    return (
      !!amount && amount > 0 && amount <= (assets?.underlying.balance ?? 0)
    );
  };

  return (
    <form
      id={formId}
      className={`mb-6 rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-lg ${
        fullWidth ? "md:col-span-2" : ""
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        handleWithdraw();
      }}
    >
      {isLoadingAssets ? (
        <div className="flex items-center justify-center h-40">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
            <span className="text-white">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <h2 className="mb-4 text-xl font-semibold text-white">
            {assets?.underlying.symbol}
          </h2>

          <BalanceCard
            shareAssetBalance={formatAssetBalance(assets?.share)}
            shareAssetSymbol={assets?.share.symbol || ""}
            underlyingAssetBalance={formatAssetBalance(assets?.underlying)}
            underlyingSymbol={assets?.underlying.symbol || ""}
          />

          <div className="mb-6">
            <Input
              id={`withdrawAmount-${formId}`}
              label="Amount to withdraw"
              placeholder="0.0"
              value={withdrawAmount?.displayAmount ?? ""}
              onChange={handleAmountChange}
              inputMode="decimal"
              error={
                withdrawAmount && !isWithdrawAmountValid()
                  ? `Please enter a valid amount (max ${formatAssetBalance(
                      assets?.underlying
                    )} ${assets?.underlying?.symbol ?? ""})`
                  : undefined
              }
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              type="button"
              onClick={handleMaxClick}
              variant="secondary"
              fullWidth
              disabled={isWithdrawLoading}
            >
              Max
            </Button>
            <Button
              type="submit"
              disabled={!isWithdrawAmountValid() || isWithdrawLoading}
              variant="primary"
              fullWidth
            >
              {isWithdrawLoading ? "Withdrawing..." : "Withdraw"}
            </Button>
          </div>
        </>
      )}

      <Dialog
        title="Withdrawal Failed"
        description="An error occurred while sending the transaction. This might be due to insufficient funds or a network issue. Please check your wallet balance and try again."
        isOpen={isErrorWithdrawDialogOpen}
        close={() => setIsErrorWithdrawDialogOpen(false)}
      />
    </form>
  );
};

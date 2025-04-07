type ShortenAddressProps = {
  address: string;
};

const shortenAddress = (addr: string) =>
  addr.slice(0, 6) + "..." + addr.slice(-4);

export const ShortenAddress = ({ address }: ShortenAddressProps) => {
  return (
    <div className="flex items-center rounded-full bg-gray-600 px-4 py-2">
      <span className="text-sm font-medium text-white">
        {shortenAddress(address)}
      </span>
    </div>
  );
};

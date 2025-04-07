export enum LendingPlatformId {
  Fluid = "fluid",
  Morpho = "morpho",
  Venus = "venus",
}

export enum ChainId {
  Ethereum = 1,
}

type LendingContractInfo = {
  address: string;
};

type LendingPlatform = {
  id: LendingPlatformId;
  chainId: ChainId;
  name: string;
  logo: string;
  contractsInfo: LendingContractInfo[];
};

export const supportedPlatforms: Readonly<LendingPlatform[]> = [
  {
    id: LendingPlatformId.Fluid,
    chainId: ChainId.Ethereum,
    name: "Fluid",
    logo: "/fluid-logo.png",
    contractsInfo: [{ address: "0x9fb7b4477576fe5b32be4c1843afb1e55f251b33" }],
  },
  {
    id: LendingPlatformId.Morpho,
    chainId: ChainId.Ethereum,
    name: "Morpho",
    logo: "/morpho-logo.png",
    contractsInfo: [{ address: "0xd63070114470f685b75B74D60EEc7c1113d33a3D" }],
  },
  {
    id: LendingPlatformId.Venus,
    chainId: ChainId.Ethereum,
    name: "Venus",
    logo: "/venus-logo.png",
    contractsInfo: [{ address: "0x17C07e0c232f2f80DfDbd7a95b942D893A4C5ACb" }],
  },
];

export const platformById = Object.fromEntries(
  supportedPlatforms.map((platform) => [platform.id, platform])
) as Readonly<Record<LendingPlatformId, LendingPlatform>>;

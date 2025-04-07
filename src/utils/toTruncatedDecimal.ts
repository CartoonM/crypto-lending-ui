import { formatUnits } from "ethers";

export const toTruncatedDecimal = (
  value: bigint,
  units: number,
  truncToDecimals: number
) => {
  const formattedValue = formatUnits(value, units);

  let [intPart, decPart = ""] = formattedValue.split(".");

  if (decPart.length > truncToDecimals) {
    decPart = decPart.slice(0, truncToDecimals);
  }

  decPart = decPart.replace(/0+$/, "");

  return decPart ? `${intPart}.${decPart}` : intPart;
};

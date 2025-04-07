import clsx from "clsx";
import type { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

import { Button as HeadlessuiButton } from "@headlessui/react";

type Variant = "primary" | "secondary" | "gray";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500 disabled:opacity-50",
  secondary: "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-600",
  gray: "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-600",
};

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  variant = "primary",
  className,
  fullWidth,
  ...props
}) => {
  return (
    <HeadlessuiButton
      {...props}
      className={clsx(
        "rounded-lg px-6 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200",
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </HeadlessuiButton>
  );
};

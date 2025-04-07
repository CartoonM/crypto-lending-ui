import { Input as HeadlessuiInput } from "@headlessui/react";

type InputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export const Input: React.FC<InputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  inputMode = "text",
}) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-400"
      >
        {label}
      </label>
      <HeadlessuiInput
        type="text"
        id={id}
        className="block w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-2 focus:ring-gray-600"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputMode={inputMode}
      />
      <p
        className={`mt-1 text-sm text-red-500 transition-opacity duration-200 ${
          error ? "opacity-100" : "opacity-0"
        }`}
        style={{ minHeight: "1.25rem" }}
      >
        {error || "⠀"}
      </p>
    </div>
  );
};

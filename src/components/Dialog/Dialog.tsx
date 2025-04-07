import {
  Dialog as BaseDialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export namespace Dialog {
  export type Props = {
    isOpen: boolean;
    close: () => void;
    title: string;
    description: string;
  };
}

export const Dialog: React.FC<Dialog.Props> = ({
  title,
  description,
  isOpen,
  close,
}) => {
  return (
    <BaseDialog open={isOpen} onClose={close} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-md w-full rounded-2xl bg-gray-800 p-6 shadow-xl space-y-5">
          <DialogTitle className="text-lg font-semibold text-white">
            {title}
          </DialogTitle>

          <p className="text-sm text-gray-300">{description}</p>

          <div className="flex justify-end">
            <button
              onClick={close}
              className="rounded-xl bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </BaseDialog>
  );
};

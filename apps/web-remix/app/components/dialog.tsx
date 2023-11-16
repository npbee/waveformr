import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef } from "react";
import { clsx } from "clsx";
import { Icon } from "./icons";

export const DialogContent = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="bg-gray-900/10 data-[state=open]:animate-overlayShow fixed inset-0" />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className={clsx(
        "fixed",
        "top-1/2",
        "max-h-[85vh]",
        "w-[90vw]",
        "max-w-[450px]",
        "px-8",
        "py-4",
        "left-1/2",
        "-translate-x-1/2",
        "-translate-y-1/2",
        "rounded",
        "bg-white",
        "data-[state=open]:animate-contentShow",
        "shadow-lg",
      )}
    >
      {children}
      <DialogPrimitive.Close
        aria-label="Close"
        className="absolute top-4 right-4"
      >
        <Icon name="close" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogTitleProps
>(function DialogTitle(props, ref) {
  return (
    <DialogPrimitive.DialogTitle {...props} ref={ref} className="text-lg" />
  );
});

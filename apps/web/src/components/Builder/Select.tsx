import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
} from "lucide-react";

export const Select = React.forwardRef<
  HTMLButtonElement,
  SelectPrimitive.SelectProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        ref={forwardedRef}
        className="flex h-8 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent py-2 px-3 text-xs placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-900"
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon>
          <ChevronDownIcon size="1.2em" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="borer-slate-100 animate-in fade-in-80 relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-slate-700 shadow-md  dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
          <SelectPrimitive.ScrollUpButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1">
            {children}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton>
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Item
      {...props}
      ref={forwardedRef}
      className="relative flex cursor-default select-none items-center justify-between rounded-sm py-1.5 px-2 text-xs font-medium outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <CheckIcon size="1em" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

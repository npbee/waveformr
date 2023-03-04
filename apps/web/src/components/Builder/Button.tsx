import { forwardRef } from "react";
import { clsx } from "clsx";
import { VariantProps, cva } from "class-variance-authority";

let buttonVariants = cva(
  "active:scale-95 inline-flex text-sm items-center gap-2 rounded-md font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-white dark:bg-grayDark4 text-gray12 dark:text-grayDark12 border border-gray11 dark:border-grayDark11",
        subtle:
          "text-gray11 hover:underline underline-offset-2 hover:text-gray12 trans-all",
      },
      size: {
        default: "h-8 py-1 px-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
}

export let Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref
) {
  let { icon, children, variant, size, ...rest } = props;
  return (
    <button
      {...rest}
      ref={ref}
      className={clsx(buttonVariants({ variant, size }))}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
});

import { forwardRef } from "react";
import { clsx } from "clsx";
import { VariantProps, cva } from "class-variance-authority";

let buttonVariants = cva(
  "active:scale-95 inline-flex items-center rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 transition-all",
  {
    variants: {
      variant: {
        default: "bg-cyan-900 text-cyan-50",
        subtle:
          "text-gray-600 dark:text-gray-400 hover:underline underline-offset-2 hover:text-gray12 trans-all",
      },
      size: {
        default: "h-9 px-4 text-sm gap-2",
        small: "h-6 text-xs gap-1",
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
      style={{ transitionProperty: "opacity, transform" }}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
});

import { forwardRef } from "react";
import { clsx } from "clsx";
import { cva, VariantProps } from "class-variance-authority";
import { Link } from "@remix-run/react";

let btnOuter = cva(
  "border-2 border-[transparent] rounded inline-flex items-stretch group",
  {
    variants: {
      variant: {
        default: "bg-gray-950 shadow-lg ",
        subtle:
          "border border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 underline-offset-2 hover:text-gray-500 trans-all dark:border-gray-700",
      },
      size: {
        default: "h-9",
        small: "h-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

let btnInner = cva(
  "rounded-sm px-2 flex items-center font-medium tracking-wide transition-all duration-75 ",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white shadow-inner shadow-primary-400 group-hover:bg-primary-600/95 group-active:scale-[99%] group-active:shadow-gray-900/50 ",
        subtle: "bg-none group-hover:bg-gray-50 group-active:bg-gray-100",
      },
      size: {
        default: "text-sm gap-2",
        small: "text-xs gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof btnOuter> {
  icon?: React.ReactNode;
}

export let Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    let { icon, children, variant, size, ...rest } = props;
    return (
      <button
        {...rest}
        ref={ref}
        className={clsx(btnOuter({ variant, size }))}
        style={{ transitionProperty: "opacity, transform" }}
      >
        <span className={btnInner({ variant, size })}>
          {icon}
          {children}
        </span>
      </button>
    );
  },
);

export function ButtonLink(
  props: React.ComponentProps<typeof Link> & VariantProps<typeof btnOuter>,
) {
  const { variant = "default", size = "default", ...rest } = props;
  return (
    <Link {...rest} className={btnOuter({ variant, size })}>
      <span className={btnInner({ variant, size })}>{props.children}</span>
    </Link>
  );
}

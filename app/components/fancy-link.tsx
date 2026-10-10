import { Link } from "@remix-run/react";

export function FancyLink(props: React.ComponentProps<typeof Link>) {
  return (
    <span className="inline-flex relative text-primary-700 group text-sm font-bold">
      <svg
        aria-hidden="true"
        className="z-0 select-none w-full absolute bottom-1 group-hover:text-primary-700 left-0"
        viewBox="0 0 231 12"
      >
        <use href="#straight-fat-horizontal" />
      </svg>
      <svg
        aria-hidden="true"
        className="z-0 select-none w-[95%] transition-all group-hover:w-full absolute -bottom-0 group-hover:text-primary-700 left-0"
        viewBox="0 0 231 12"
      >
        <use href="#straight-sputter" />
      </svg>
      <Link {...props} className="h-7 block z-10 cursor-pointer relative " />
    </span>
  );
}

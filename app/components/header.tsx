import { ReactNode } from "react";
import { LogoLink } from "./logo";

export function Header(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <header className="flex justify-between px-4 py-3 dark:border-gray-700">
      <div className="flex gap-4 items-center text-gray-800 hover:text-primary-800 dark:text-gray-50 dark:hover:text-cyan-700">
        <LogoLink />
      </div>

      <div className="flex gap-4 items-center">{children}</div>
    </header>
  );
}

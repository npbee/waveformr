import { Link } from "@remix-run/react";
import { Header } from "~/components/header";
import { Icon } from "~/components/icons";

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EditorLayout(props: LayoutProps) {
  return (
    <div className="flex h-full flex-col dark:bg-gray-900">
      <Header>
        <a href="https://github.com/npbee/waveformr">
          <svg
            className="w-5 text-[#24292f] dark:text-white"
            viewBox="0 0 98 96"
          >
            <use href="#github"></use>
          </svg>
          <span className="sr-only">Github</span>
        </a>
      </Header>
      {props.children}
    </div>
  );
}

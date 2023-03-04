import { Back } from "./Icons";

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  rightSlot?: React.ReactNode;
  title?: string;
}

export function Layout(props: LayoutProps) {
  let { children, rightSlot, title } = props;
  return (
    <div className="flex h-full flex-col">
      {title ? (
        <header className="flex w-full items-center justify-between px-8 py-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg text-gray12">{title}</h1>
          </div>

          {rightSlot}
        </header>
      ) : null}
      {children}
      <footer className="flex justify-center px-8 py-3">
        <a
          className="text-xs font-semibold lowercase tracking-wide text-gray11"
          href="/"
        >
          Waveformr
        </a>
      </footer>
    </div>
  );
}

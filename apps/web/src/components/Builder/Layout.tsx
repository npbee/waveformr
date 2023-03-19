interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Layout(props: LayoutProps) {
  let { children } = props;
  return (
    <div className="flex h-full flex-col dark:bg-gray-900">
      <header className="flex justify-between border-b border-gray-200 px-8 py-3 dark:border-gray-700">
        <a
          href="/"
          className="flex w-24 text-gray-800 hover:text-cyan-800 dark:text-gray-50 dark:hover:text-cyan-700"
        >
          <svg viewBox="0 0 86 20">
            <use href="#lockup"></use>
          </svg>
        </a>
        <a
          href="https://github.com/npbee/waveformr"
          className="flex w-5 text-gray-800"
        >
          <svg
            className="w-5 text-[#24292f] dark:text-white"
            viewBox="0 0 98 96"
          >
            <use href="#github"></use>
          </svg>
        </a>
      </header>
      {children}
    </div>
  );
}

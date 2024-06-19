interface BrowserProps {
  url: string;
  children: React.ReactNode;
}

export function Browser(props: BrowserProps) {
  const { children, url } = props;
  return (
    <div className="border border-gray-200 rounded-xl w-full shadow-lg translate-x-0">
      <div className="h-[56px] border-b flex items-center px-6 gap-4">
        <div className="controls flex gap-2">
          <div className="w-3 aspect-square rounded-full bg-[#ED6A5E]" />
          <div className="w-3 aspect-square rounded-full bg-[#F4BF4F]" />
          <div className="w-3 aspect-square rounded-full bg-[#61C554]" />
        </div>
        <div className="bg-[#F1F1F1] dark:bg-[#1e1e1e] py-2 px-2 rounded-md flex-1 overflow-hidden">
          <div className="flex gap-2 items-center justify-start text-gray-600">
            <Lock />
            <span className="text-sm flex-1 dark:text-gray-300 text-left whitespace-nowrap overflow-hidden">
              {url}
            </span>
            <span className="text-gray-400 flex-shrink-0">
              <Refresh />
            </span>
          </div>
        </div>
      </div>
      <div className="p-8 pb-48">{children}</div>
    </div>
  );
}

function Lock() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-lock"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Refresh() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-rotate-cw"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

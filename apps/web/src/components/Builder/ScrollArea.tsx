import * as RadixScrollArea from "@radix-ui/react-scroll-area";

export function ScrollArea(props: { children: React.ReactNode }) {
  return (
    <RadixScrollArea.Root className="h-full overflow-hidden">
      <RadixScrollArea.Viewport className={`h-full w-full [&>div]:h-full`}>
        {props.children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        className="data-[state=visible]:opacity-1 flex touch-none select-none bg-inherit p-[2px] transition-opacity data-[orientation=vertical]:w-3 data-[state=hidden]:opacity-0"
        orientation="vertical"
      >
        <RadixScrollArea.Thumb className="before:min-w-3 flex-1 rounded bg-gray7 before:absolute before:top-1/2 before:left-1/2 before:h-full before:min-h-[44px] before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Corner className="bg-gray8" />
    </RadixScrollArea.Root>
  );
}

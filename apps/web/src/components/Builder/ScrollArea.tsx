import * as RadixScrollArea from "@radix-ui/react-scroll-area";

export function ScrollArea(props: { children: React.ReactNode }) {
  return (
    <RadixScrollArea.Root className="h-full overflow-hidden">
      <RadixScrollArea.Viewport className={`h-full w-full [&>div]:h-full`}>
        {props.children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        className="data-[state=visible]:opacity-1 bg-inherit flex touch-none select-none p-[2px] transition-opacity data-[orientation=vertical]:w-3 data-[state=hidden]:opacity-0"
        orientation="vertical"
      >
        <RadixScrollArea.Thumb className="before:min-w-3 bg-gray7 flex-1 rounded before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Scrollbar
        className="bg-blackA6 hover:bg-blackA8 flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
        orientation="horizontal"
      >
        <RadixScrollArea.Thumb className="bg-mauve10 relative flex-1 rounded-[10px] before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Corner className="bg-gray8" />
    </RadixScrollArea.Root>
  );
}

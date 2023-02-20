import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentProps } from "react";
import { Builder } from "./Builder";

let queryClient = new QueryClient();

export function BuilderApp(props: ComponentProps<typeof Builder>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Builder {...props} />
    </QueryClientProvider>
  );
}

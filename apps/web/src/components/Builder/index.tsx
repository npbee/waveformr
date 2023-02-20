import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Builder } from "./Builder";

let queryClient = new QueryClient();

export function BuilderApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <Builder />
    </QueryClientProvider>
  );
}

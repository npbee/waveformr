import { useSearchParams } from "@remix-run/react";
import { Button } from "./button";
import { Label } from "./label";

export function URLForm() {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="audio-url">URL</Label>
      <div className="flex gap-4 items-center">
        <input
          id="audio-url"
          name="url"
          className="rounded border border-gray-800 px-4 py-1 text-base flex-1"
          placeholder="https://file.mp3"
          autoFocus
        />
        {Array.from(searchParams.entries()).map(([key, value]) => {
          if (key === "url") return null;
          return <input type="hidden" name={key} value={value} key={key} />;
        })}
        <div className="flex justify-end">
          <Button>Analyze</Button>
        </div>
      </div>
    </div>
  );
}

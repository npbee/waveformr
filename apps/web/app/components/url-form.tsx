import { useSearchParams } from "@remix-run/react";
import { Button } from "./button";
import { Label } from "./label";

export function URLForm() {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="audio-url">URL</Label>
        <input
          id="audio-url"
          name="url"
          className="rounded border border-gray-800 px-4 py-2 text-base"
          placeholder="https://file.mp3"
          autoFocus
        />
        {Array.from(searchParams.entries()).map(([key, value]) => {
          if (key === "url") return null;
          return <input type="hidden" name={key} value={value} key={key} />;
        })}
      </div>
      <div className="flex justify-end">
        <Button>Save</Button>
      </div>
    </div>
  );
}

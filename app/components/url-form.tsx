import { useNavigate } from "@tanstack/react-router";
import { Button } from "./button";
import { Label } from "./label";

export function URLForm(props: { onSubmit?: () => void }) {
  const navigate = useNavigate();

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(evt) => {
        evt.preventDefault();
        const url = new FormData(evt.currentTarget).get("url");
        if (typeof url !== "string" || !url) return;
        props.onSubmit?.();
        // Keeps the current style when swapping audio from the editor
        navigate({ to: "/edit", search: (prev) => ({ ...prev, url }) });
      }}
    >
      <Label htmlFor="audio-url">URL</Label>
      <div className="flex gap-4 items-center">
        <input
          id="audio-url"
          name="url"
          className="rounded border border-gray-800 px-4 py-1 text-base flex-1"
          placeholder="https://file.mp3"
          autoFocus
        />
        <div className="flex justify-end">
          <Button>Analyze</Button>
        </div>
      </div>
    </form>
  );
}

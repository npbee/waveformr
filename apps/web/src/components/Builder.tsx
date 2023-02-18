import { DropZone } from "./DropZone";

interface BuilderProps {
  analyzeUrl: string;
}

export function Builder(props: BuilderProps) {
  let { analyzeUrl } = props;

  function analyzeAudio(file: File, samples: number) {
    let formData = new FormData();
    formData.set("file", file);
    formData.set("samples", String(samples));
    fetch(analyzeUrl, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  function onFile(file: File) {
    analyzeAudio(file, 200);
  }

  return (
    <div className="w-full space-y-8">
      <DropZone onDrop={onFile} />
    </div>
  );
}

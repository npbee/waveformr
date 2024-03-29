import { DragEvent, useId, useState } from "react";
import { clsx } from "clsx";
import { Button } from "./button";
import { HiddenFileInput } from "./hidden-file-input";

interface DropZoneProps {
  onDrop: (file: File) => void;
}

export function DropZone(props: DropZoneProps) {
  let { onDrop } = props;
  let id = useId();
  let [focused, setFocused] = useState(false);
  let [dragging, setDragging] = useState(false);

  function onClick() {
    let inputEl = document.getElementById(id);
    if (inputEl) {
      inputEl.click();
    }
  }

  function onDragEnter(evt: DragEvent<HTMLDivElement>) {
    evt.preventDefault();
    evt.stopPropagation();
    setDragging(true);
  }

  function onDragOver(evt: DragEvent<HTMLDivElement>) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function onDragLeave() {
    setDragging(false);
  }

  function handleDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    let fileList = getDataTransferFiles(evt);
    let file = fileList[0];

    if (file instanceof File) {
      onDrop(file);
    }
  }

  return (
    <div
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className={clsx(
        "border-2",
        "cursor-pointer",
        "p-6",
        "rounded",
        "border-gray-400",
        "dark:border-gray-700",
        "border-dashed",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "hover:bg-gray-50",
        "dark:hover:bg-gray-800",
        "transition",
        "hover:border-cyan-700",
        "gap-4",
        "h-48",
        focused && "border-cyan-900",
      )}
    >
      {dragging ? (
        <p className="text-sky-700 text-sm font-semibold">
          Drop file to analyze
        </p>
      ) : (
        <Button size="small">Select file</Button>
      )}
      <HiddenFileInput
        id={id}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        onFile={(file) => {
          onDrop(file);
        }}
      />
    </div>
  );
}

const dragEvents = ["dragover", "dragenter", "drop"];

export function getDataTransferFiles(event: DragEvent): File[] {
  if (isDragEvent(event) && event.dataTransfer) {
    const dt = event.dataTransfer;

    if (dt.files && dt.files.length) {
      return Array.from(dt.files);
    } else if (dt.items && dt.items.length) {
      // Chrome is the only browser that allows to read the file list on drag
      // events and uses `items` instead of `files` in this case.
      // @ts-ignore - Browser bug
      return Array.from(dt.items);
    }
    // @ts-ignore - Browser bug
  } else if (isChangeEvent(event) && event.target.files) {
    // Return files from even when a file was selected from an upload dialog
    // @ts-ignore - Browser bug
    return Array.from(event.target.files);
  }

  return [];
}

function isChangeEvent(event: DragEvent) {
  return Object.prototype.hasOwnProperty.call(event, "target");
}

function isDragEvent(event: DragEvent): event is DragEvent {
  return dragEvents.indexOf(event.type) > 0;
}

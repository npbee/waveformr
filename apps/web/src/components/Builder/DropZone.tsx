import { DragEvent, useId, useState } from "react";
import { clsx } from "clsx";
import { Button } from "./Button";

interface DropZoneProps {
  onDrop: (file: File) => void;
  onSample: () => void;
}

// Hidden label
// https://polaris.shopify.com/components/selection-and-input/drop-zone

export function DropZone(props: DropZoneProps) {
  let { onDrop, onSample } = props;
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

  // TODO Could be nice to do the whole page
  // https://github.com/Shopify/polaris/blob/main/polaris-react/src/components/DropZone/DropZone.tsx#L288
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
      onDragExit={onDragLeave}
      onDrop={handleDrop}
      className={clsx(
        "border-2",
        "p-5",
        "rounded",
        "border-dashed",
        focused && "border-sky-900"
      )}
    >
      {dragging ? <div>Drop it</div> : <div>Add file</div>}
      <Button
        onClick={(evt) => {
          evt.stopPropagation();
          evt.preventDefault();
          onSample();
        }}
      >
        Or use a sample
      </Button>
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

interface HiddenFileInputProps {
  id: string;
  accept?: string;
  onFocus: () => void;
  onBlur: () => void;
  onFile: (file: File) => void;
}

function HiddenFileInput(props: HiddenFileInputProps) {
  let { onBlur, onFocus, id, onFile } = props;
  return (
    <input
      className="sr-only"
      id={id}
      type="file"
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={(evt) => {
        let el = evt.target as HTMLInputElement;
        if (el.files) {
          let file = el.files[0];
          onFile(file);
        }
      }}
    />
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

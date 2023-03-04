import { forwardRef, useRef } from "react";
import { Button } from "./Button";

interface HiddenFileInputProps {
  id?: string;
  accept?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onFile: (file: File) => void;
}

export let HiddenFileInput = forwardRef<HTMLInputElement, HiddenFileInputProps>(
  function HiddenFileInput(props, ref) {
    let { onBlur, onFocus, id, onFile } = props;
    return (
      <input
        ref={ref}
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
);

export function HiddenFileInputButton(
  props: React.ComponentProps<typeof Button> & HiddenFileInputProps
) {
  let { id, accept, onFile, children, ...rest } = props;
  let inputRef = useRef<HTMLInputElement>(null);

  return (
    <Button
      {...rest}
      onClick={() => {
        inputRef.current?.click();
      }}
    >
      <HiddenFileInput onFile={onFile} id={id} ref={inputRef} />
      {children}
    </Button>
  );
}

interface IconProps extends React.SVGAttributes<SVGElement> {
  name:
    | "edit"
    | "upload"
    | "settings"
    | "copy"
    | "check"
    | "close"
    | "reset"
    | "arrow-right"
    | "corner-right-down"
    | "braces"
    | "wordmark";

  size?: string;
}

export function Icon(props: IconProps) {
  const { name, size = "0.9em", ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...rest}
    >
      <use href={`#${name}`} />
    </svg>
  );
}

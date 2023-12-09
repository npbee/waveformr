export function Label(props: React.ComponentPropsWithoutRef<"label">) {
  return (
    <label
      className="text-xs font-semibold tracking-wide dark:text-gray-400"
      {...props}
    >
      {props.children}
    </label>
  );
}

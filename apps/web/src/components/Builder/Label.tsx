export function Label(props: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-xs font-medium tracking-wide dark:text-gray-400">
      {props.children}
    </label>
  );
}

export function Label(props: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-xs font-medium tracking-wide text-gray12 dark:text-grayDark11">
      {props.children}
    </label>
  );
}

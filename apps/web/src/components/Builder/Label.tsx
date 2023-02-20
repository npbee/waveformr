export function Label(props: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wide text-gray11 dark:text-grayDark11">
      {props.children}
    </label>
  );
}

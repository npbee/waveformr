export function SvgSize(props: { size: string }) {
  const { size } = props;
  return (
    <dl className="text-xs font-medium text-gray-500 dark:text-gray-400 flex gap-1">
      <dt className="after:content-[':']">Output size</dt>
      <dd>{size}</dd>
    </dl>
  );
}

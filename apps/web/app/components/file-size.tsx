import { Await } from "@remix-run/react";
import { Suspense } from "react";

export function SvgSize(props: { size: Promise<string> }) {
  return (
    <Suspense fallback={null}>
      <Await resolve={props.size}>{(size) => <HumanSize size={size} />}</Await>
    </Suspense>
  );
}

function HumanSize(props: { size: string }) {
  const { size } = props;
  return (
    <dl className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex gap-1">
      <dt className="after:content-[':']">Output size</dt>
      <dd>{size}</dd>
    </dl>
  );
}

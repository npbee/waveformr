import { LinksFunction, MetaFunction } from "@remix-run/node";
import { useNavigation, Form, Link } from "@remix-run/react";
import { EditorLayout } from "~/routes/edit/layout";
import { Icon } from "~/components/icons";
import { URLForm } from "~/components/url-form";
import { getLinks, getSeo } from "~/seo";

export const meta: MetaFunction = () => [
  ...getSeo({
    title: "New waveform - Waveformr",
    description:
      "Design, and build responsive audio waveform visualizations that you can copy and paste to your site or serve as an image.",
    pathname: "/new",
  }),
];

export const links: LinksFunction = () => [...getLinks({ pathname: "/new" })];

export default function NewRoute() {
  const navigation = useNavigation();

  if (navigation.state === "submitting" || navigation.state === "loading") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-lg font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  return <EmptyState />;
}

function EmptyState() {
  return (
    <EditorLayout>
      <div className="mx-auto flex h-full max-w-6xl flex-1 flex-col gap-12 p-4 md:gap-24">
        <Form method="GET" action="/edit">
          <URLForm />
        </Form>

        <ol className="flex flex-col justify-between gap-12 md:flex-row md:gap-24">
          <ListItem title="Add a URL" icon={<Icon name="upload" />}>
            Enter a URL to an MP3 audio file or try using a{" "}
            <Link
              className="trans font-semibold text-cyan-800 underline underline-offset-2 hover:text-cyan-600 dark:text-cyan-50 dark:hover:text-cyan-700"
              to={`/edit?url=https://res.cloudinary.com/dhhjogfy6//video/upload/q_auto/v1575831765/audio/ghost.mp3`}
            >
              sample
            </Link>
            . Audio is never stored on our servers.
          </ListItem>
          <ListItem title="Configure" icon={<Icon name="settings" />}>
            Change colors, style, and tweak settings until the design looks just
            right.
          </ListItem>
          <ListItem title="Copy and Paste" icon={<Icon name="copy" />}>
            Copy the resulting SVG code and paste it directly into your site.
          </ListItem>
        </ol>
      </div>
    </EditorLayout>
  );
}

interface ListItemProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  title: string;
}

function ListItem(props: ListItemProps) {
  const { icon, title, children } = props;

  return (
    <li className="flex flex-1 flex-col gap-2 text-base leading-normal">
      <div className="flex flex-col items-start gap-4">
        <span className="inline-flex w-fit rounded-full text-lg text-cyan-800 dark:text-cyan-600">
          {icon}
        </span>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </h3>
      </div>
      <p className="leading-normal text-gray-600 dark:text-gray-300">
        {children}
      </p>
    </li>
  );
}

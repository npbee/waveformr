import { HtmlLinkDescriptor, MetaDescriptor } from "@remix-run/node";

const ogImage = "https://waveformr.com/og.png";

export function getSeo(props: {
  title: string;
  description: string;
  pathname: string;
}): Array<MetaDescriptor> {
  const { title, description, pathname } = props;
  return [
    {
      title,
    },
    {
      itemProp: "name",
      content: title,
    },
    {
      property: "og:title",
      content: title,
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "description",
      content: description,
    },
    {
      itemProp: "description",
      content: description,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      name: "twitter:description",
      content: description,
    },
    {
      itemProp: "image",
      content: ogImage,
    },
    {
      property: "og:image",
      content: ogImage,
    },
    {
      name: "twitter:image",
      content: ogImage,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: canonical(pathname),
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:creator",
      content: "@_nickball",
    },
  ];
}

export function getLinks(opts: {
  pathname: string;
}): Array<HtmlLinkDescriptor> {
  return [
    {
      rel: "canonical",
      href: canonical(opts.pathname),
    },
  ];
}

function canonical(pathname: string) {
  return new URL(pathname, "https://waveformr.com").toString();
}

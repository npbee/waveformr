import { LinksFunction, MetaFunction } from "@remix-run/node";
import { Balancer } from "react-wrap-balancer";
import { Browser } from "~/components/browser";
import { Button, ButtonLink } from "~/components/button";
import { Header } from "~/components/header";
import { getLinks, getSeo } from "~/seo";
import { ReactNode } from "react";
import { FancyLink } from "~/components/fancy-link";
import clsx from "clsx";
import { LogoLink } from "~/components/logo";
import { AudioPlayer } from "~/components/audio-player";

const exampleURL =
  "https://api.waveformr.com/render?url=https://res.cloudinary.com/dhhjogfy6//video/upload/q_auto/v1575831765/audio/ghost.mp3&stroke=linear-gradient(coral,steelblue)";

export const meta: MetaFunction = () => [
  ...getSeo({
    title: "Responsive audio waveform image service - Waveformr",
    description:
      "Display audio waveforms like an image. Analyze, design, and build responsive audio waveform visualizations that you can copy and paste to your site or serve as an image.",
    pathname: "/",
  }),
];

export const links: LinksFunction = () => [...getLinks({ pathname: "/" })];

export default function IndexRoute() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="flex h-full flex-col dark:bg-gray-900">
        <div className="container mx-auto">
          <Header>
            <a href="https://github.com/npbee/waveformr">
              <svg
                className="w-5 text-[#24292f] dark:text-white"
                viewBox="0 0 98 96"
              >
                <use href="#github"></use>
              </svg>
              <span className="sr-only">Github</span>
            </a>
          </Header>
        </div>
        <main className="flex h-full flex-col items-center">
          <div className="flex w-full flex-1 flex-col items-center gap-24 pb-24 text-gray-700 dark:text-gray-50">
            <div className="absolute left-0 w-full">
              <Banner />
            </div>

            <Hero />
            <div className="flex w-24 -my-12">
              <TriangleWave />
            </div>
            <div className="container relative mx-auto flex w-full flex-col justify-between gap-12 p-8">
              <div className="flex max-w-prose flex-1 flex-col gap-4">
                <h2 className="flex-1 font-display text-4xl">
                  <Balancer>Give your audio players a visual boost</Balancer>
                </h2>
                <p className="flex-2 text-lg text-gray-600">
                  Waveformr is an API for displaying audio waveforms like an
                  image. Use it to display your waveforms in your audio players
                  without expensive client-side JavaScript.
                </p>
              </div>
              <div className="right-0 w-full self-end">
                <AudioPlayer />
              </div>
            </div>
            <div className="relative w-full text-primary-50 bg-gray-950/95 py-24">
              <div className="container w-full grid grid-cols-4 mx-auto gap-12 p-8">
                <Feature title="Responsive" icon={<Phone />}>
                  The Waveformr API uses an SVG format that is responsive
                  without the need for JavaScript.
                </Feature>
                <Feature title="Customizable" icon={<SettingsIcon />}>
                  Provide parameters on the URL to change the style and colors.
                </Feature>
                <Feature title="Performant" icon={<GaugeIcon />}>
                  Responses are fast and heavily cached so expensive audio
                  analysis is only done when absolutely needed.
                </Feature>
                <Feature title="Open source" icon={<GitBranchIcon />}>
                  All source code is proudly available on{" "}
                  <FancyLink to="https://github.com/npbee/waveformr">
                    GitHub
                  </FancyLink>
                  .
                </Feature>
              </div>
            </div>

            <div className="container mx-auto max-w-xl p-8 py-8">
              <Card title="How much?">
                For now...free! The public API is open with a generous rate
                limit. Interested in more features like higher usage or
                file-based waveforms? Sign up for updates below.
                <form
                  action="https://buttondown.email/api/emails/embed-subscribe/waveformr"
                  method="post"
                  target="popupwindow"
                  onSubmit={(evt) => {
                    window.open(
                      "https://buttondown.email/waveformr",
                      "popupwindow",
                    );
                  }}
                  className="py-4 flex flex-col gap-1"
                >
                  <label htmlFor="bd-email" className="">
                    Enter your email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      id="bd-email"
                      className="border border-gray-300 rounded px-2 py-1 flex-1"
                    />

                    <div>
                      <Button type="submit">Subscribe</Button>
                    </div>
                  </div>
                </form>
              </Card>
            </div>
          </div>
          <footer className="relative flex w-full items-start bg-gray-950 p-8 py-12">
            <div className="absolute left-1/2 top-1/2 w-8 -translate-x-1/2 -translate-y-1/2 md:w-12">
              <Sawtooth />
            </div>
            <div className="container mx-auto flex items-center justify-between text-primary-50">
              <LogoLink />
              <a href="https://github.com/npbee/waveformr">
                <svg
                  className="w-5 text-primary-50 dark:text-white"
                  viewBox="0 0 98 96"
                >
                  <use href="#github"></use>
                </svg>
                <span className="sr-only">Github</span>
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Card(props: { title: string; children: React.ReactNode }) {
  const { title, children } = props;
  return (
    <div className="relative rounded-lg border-4 border-accent-purple p-4 shadow-2xl ring-4 ring-accent-red ring-offset-4 ring-offset-accent-orange">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl">{title}</h2>
        <div className="font-medium text-gray-700 dark:text-gray-200 font-displayMono">
          {children}
        </div>
      </div>
    </div>
  );
}

const prettifiedUrl = prettyUrl(exampleURL);

function Hero() {
  return (
    <div className="container relative mx-auto flex w-full flex-col p-4">
      <div className="relative flex w-full flex-1 flex-col gap-6 pt-24 pb-12 md:py-24">
        <h1 className="font-display text-5xl max-w-4xl text-gray-700 dark:text-gray-200">
          <Balancer>Generate audio waveforms on the fly</Balancer>
        </h1>
        <p className="max-w-xl text-xl font-medium text-gray-600/90 dark:text-gray-300 xfont-mono">
          Display beautiful, responsive audio waveforms with a URL. Embed them
          anywhere you can put an image.
        </p>
        <div>
          <ButtonLink to="/new">Try the editor</ButtonLink>
        </div>
      </div>
      <div className="flex-2 relative flex w-full flex-col items-center gap-4 md:translate-x-1/3 md:-translate-y-1/4 scale-125 origin-top-left md:scale-100">
        <Browser url={prettifiedUrl}>
          <img
            className="left-0 w-full scale-[2] md:scale-[1] origin-top-left"
            src={exampleURL}
          />
        </Browser>
      </div>
    </div>
  );
}

function prettyUrl(url: string) {
  const prettified = new URL(url);
  prettified.searchParams.set("url", "https://cdn.audio.mp3");
  return decodeURIComponent(prettified.toString());
}

function Feature(props: {
  title: string;
  children: ReactNode;
  bordered?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className={clsx("relative flex-[1] space-y-3")}>
      <div className="flex items-center gap-2">
        {props.icon}
        <h3 className="text-sm font-medium">{props.title}</h3>
      </div>
      <div className="text-sm text-gray-300">{props.children}</div>
    </div>
  );
}

// sawtoothHeight = 500;
// sawtoothWidth = 258;
function Banner() {
  return (
    <div className="flex w-full translate-y-[20px] md:translate-y-0">
      <div className="h-[64.5px] flex-1 translate-y-[23.75px] md:h-[129px] md:flex-[5] md:translate-y-[47.5px] ">
        <div className="h-[2.5px] bg-accent-orange md:h-[5px]" />
        <div className="h-[2.5px] bg-accent-red md:h-[5px]" />
        <div className="h-[2.5px] bg-accent-purple md:h-[5px]" />
      </div>
      <div className="w-[125px] md:w-[250px]">
        <Sawtooth />
      </div>
      <div className="h-[64.5px] flex-[1] translate-y-[23.75px] md:h-[129px] md:translate-y-[47.5px] ">
        <div className="h-[2.5px] bg-accent-orange md:h-[5px]" />
        <div className="h-[2.5px] bg-accent-red md:h-[5px]" />
        <div className="h-[2.5px] bg-accent-purple md:h-[5px]" />
      </div>
    </div>
  );
}

function Sawtooth() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 258">
      <g fill="none" fillRule="evenodd" strokeWidth="10">
        <path
          className="stroke-accent-purple"
          d="M0 120h120V80l100 160V80l100 160V80.908L420 240V120h80"
        />
        <path
          className="stroke-accent-red"
          d="M0 110h110V48l100 162V50l100 160V50l100 160V110h90"
        />
        <path
          className="stroke-accent-orange"
          d="M0 100h100V18l100 160V18l100 160V18l100 160v-78h100"
        />
      </g>
    </svg>
  );
}

function SquareWave() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 130">
      <g fill="none" fillRule="evenodd" strokeWidth="10">
        <path
          stroke="#4F315B"
          d="M0 75h60V25h55v100h95V25h55v100h95V25h55v100h95V75h40"
        ></path>
        <path
          stroke="#AF3736"
          d="M0 65h50V15h75v100h75V15h75v100h75V15h75v100h75V65h50"
        ></path>
        <path
          stroke="#E97927"
          d="M0 55h40V5h95v100h55V5h95v100h55V5h95v100h55V55h60"
        ></path>
      </g>
    </svg>
  );
}

function TriangleWave() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 150">
      <g fill="none" fillRule="evenodd" strokeWidth="10">
        <path
          stroke="#4F315B"
          d="M0 80h60l20-40 60 100 60-100 60 100 60-100 60 100 40-60h40"
        ></path>
        <path
          stroke="#AF3736"
          d="M0 70h55l25-45 60 100 60-100 60 100 60-100 60 101.264L415.301 70H460"
        ></path>
        <path
          stroke="#E97927"
          d="M0 60h50l30-50 60 100 60-100 60 100 60-100 60 100 30-50h50"
        ></path>
      </g>
    </svg>
  );
}

function Phone() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-smartphone"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-settings"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-gauge"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}

function GitBranchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1dm"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-git-branch"
    >
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

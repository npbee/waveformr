import { LinksFunction, MetaFunction } from "@remix-run/node";
import { Balancer } from "react-wrap-balancer";
import { Browser } from "~/components/browser";
import { ButtonLink } from "~/components/button";
import { Header } from "~/components/header";
import { getLinks, getSeo } from "~/seo";
import { ReactNode } from "react";
import { FancyLink } from "~/components/fancy-link";
import clsx from "clsx";
import { LogoLink } from "~/components/logo";

const exampleURL =
  "https://api.waveformr.com/render?url=https://res.cloudinary.com/dhhjogfy6//video/upload/q_auto/v1575831765/audio/ghost.mp3&stroke=linear-gradient(red,blue)";

const exampleURL2 =
  "https://api.waveformr.com/render?url=https://res.cloudinary.com/dhhjogfy6//video/upload/q_auto/v1575831765/audio/ghost.mp3&stroke=4F315B&fill=AF3736&type=steps&samples=100";

export const meta: MetaFunction = () => [
  ...getSeo({
    title: "Responsive audio waveform image service - Waveformr",
    description:
      "Analyze, design, and build responsive audio waveform visualizations that you can copy and paste to your site or serve as an image.",
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
            <div className="flex w-24 opacity-50 mix-blend-luminosity">
              <TriangleWave />
            </div>
            <div className="container relative mx-auto flex w-full flex-col justify-between gap-16 p-8">
              <div className="flex max-w-prose flex-1 flex-col gap-4">
                <h2 className="flex-1 font-display text-4xl">
                  Waveforms everywhere
                </h2>
                <div className="flex-2 text-lg leading-normal">
                  <p className="font-displayMono">
                    Waveformr is an API for displaying audio waveforms like an
                    image. Provide a URL and get back a waveform. Provide
                    parameters to style it to your liking.
                  </p>
                </div>
              </div>
              <div className="right-0 w-full self-end">
                <img src={exampleURL2} />
              </div>
            </div>
            <div className="relative flex w-full flex-col gap-16 p-4 py-32 text-primary-50">
              <div className="absolute left-0 top-0 h-full w-full bg-gray-950">
                <div className="dark-grunge absolute left-0 top-0 z-0 h-full w-full select-none opacity-[30%]" />
              </div>
              <h2 className="z-10 text-center font-display text-4xl">
                Features
              </h2>
              <div className="relative">
                <div className="relative mx-auto flex w-full max-w-5xl flex-col md:border-b border-gray-50/50 md:flex-row">
                  <Feature title="Responsive" bordered>
                    The Waveformr API uses an SVG format that is responsive
                    without the need for JavaScript.
                  </Feature>
                  <Feature title="Customizable">
                    Provide parameters on the URL to change the style and
                    colors.
                  </Feature>
                </div>
                <div className="container mx-auto flex max-w-5xl flex-col md:flex-row">
                  <Feature title="Performant" bordered>
                    Responses are fast and heavily cached so expensive audio
                    analysis is only done when absolutely needed.
                  </Feature>
                  <Feature title="Open source">
                    All source code is proudly available on{" "}
                    <FancyLink to="https://github.com/npbee/waveformr">
                      GitHub
                    </FancyLink>
                    .
                  </Feature>
                </div>
              </div>
            </div>

            <div className="flex w-24 opacity-50 mix-blend-luminosity">
              <SquareWave />
            </div>

            <div className="container mx-auto max-w-xl p-8 py-8">
              <Card title="How much?">
                For now...free! The public API is open with a generous rate
                limit. Interested in more features like higher usage or
                file-based waveforms? Let me know{" "}
                <FancyLink to="https://tally.so/r/nGRy1Q">here</FancyLink>.
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
      <div className="relative flex w-full flex-1 flex-col gap-4 py-24">
        <h1 className="font-display text-4xl text-gray-700 dark:text-gray-200">
          <Balancer>Generate audio waveforms on the fly</Balancer>
        </h1>
        <p className="max-w-xl text-lg text-gray-600 font-displayMono dark:text-gray-300">
          Display beautiful, responsive audio waveforms with a URL. Embed them
          anywhere you can put an image.
        </p>
        <div>
          <ButtonLink to="/new">Try the editor</ButtonLink>
        </div>
      </div>
      <div className="flex-2 relative flex w-full flex-col items-center gap-4">
        <Browser url={prettifiedUrl}>
          <img className="left-0 w-full" src={exampleURL} />
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
}) {
  return (
    <div
      className={clsx(
        "relative flex-[1] space-y-4 p-12",
        props.bordered && "md:border-r border-gray-50/50",
      )}
    >
      <h3 className="font-display text-xl">{props.title}</h3>
      <div className="font-displayMono">{props.children}</div>
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

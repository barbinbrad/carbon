import React from "react";
import Head from "next/head";
import Features from "../features";

export default function Home() {
  return (
    <>
      <Head>
        <title>Carbon ERP</title>
        <meta
          name="og:description"
          content="Carbon ERP is an open source high performance ERP for manufacturing."
        />
      </Head>

      <div className="px-4 py-16 mx-auto sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24">
        <div className="flex flex-col justify-between text-center">
          <div>
            <h1 className="max-w-5xl mx-auto nx-text-6xl font-extrabold tracking-tighter leading-[1.1] text-6xl sm:text-7xl lg:nx-text-8xl xl:nx-text-8xl">
              ERP &nbsp;
              <span className="pr-1 inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 ">
                for the builders
              </span>
            </h1>
            <p className="mt-6 nx-text-xl font-medium leading-tight text-gray-400 sm:nx-text-2xl md:nx-text-3xl lg:nx-text-4xl">
              Carbon ERP is an open source high performance ERP for
              manufacturers.
            </p>
          </div>
        </div>
      </div>

      <div className="relative from-gray-50 to-gray-100">
        <div className="px-4 py-16 mx-auto sm:pt-20 sm:pb-24 lg:max-w-7xl lg:pt-24">
          <h2 className="nx-text-4xl font-extrabold tracking-tight lg:nx-text-5xl xl:nx-text-6xl lg:text-center dark:text-white">
            Fully customizable and extensible
          </h2>
          <p className="mx-auto mt-4 text-lg font-medium text-gray-400 lg:max-w-3xl lg:text-xl lg:text-center">
            We've taken the best of modern, open-source technology and combined
            it into a lightning-fast, easy-to-use, open-source ERP system.
          </p>
          <Features />
        </div>
      </div>
    </>
  );
}

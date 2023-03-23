import React from "react";
import type { AppProps } from "next/app";
import "../styles.css";
import "nextra-theme-docs/style.css";

export default function Docs({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

import React from "react";
import type { AppProps } from "next/app";
import "../styles.css";
import "nextra-theme-docs/style.css";

export default function Nextra({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

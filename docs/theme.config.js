// theme.config.js
import Image from "next/image";

export default {
  project: {
    link: "https://gitlab.com/barbinbrad/carbon", // GitHub link in the navbar
  },
  docsRepositoryBase:
    "https://gitlab.com/barbinbrad/carbon/blob/master/apps/docs", // base URL for the docs repository
  titleSuffix: " – Carbon",
  navigation: {
    next: true,
    prev: true,
  },
  darkMode: true,
  footer: {
    text: `Carbon ${new Date().getFullYear()} © All rights reserved.`,
  },
  editLink: {
    text: `View this page on Gitlab`,
  },
  logo: <Image src="/logo.png" width={40} height={40} />,
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="og:title" content="Nextra: the next docs builder" />
    </>
  ),
};

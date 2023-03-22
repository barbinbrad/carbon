// theme.config.js
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const useDark = () => {
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
    return () => false;
  }, [resolvedTheme]);
  return isDark;
};

export default {
  project: {
    link: "https://github.com/barbinbrad/carbon", // GitHub link in the navbar
  },
  docsRepositoryBase: "https://github.com/barbinbrad/carbon/blob/main/apps/www", // base URL for the docs repository
  navigation: {
    next: true,
    prev: true,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  darkMode: true,
  footer: {
    text: `Carbon ERP ${new Date().getFullYear()}. All rights reserved.`,
  },
  editLink: {
    text: `View this page on GitHub`,
  },
  logo: function Logo() {
    const isDark = useDark();
    return (
      <>
        <Image
          width={30}
          height={30}
          src={`/logo${isDark ? "-light" : "-dark"}.png`}
          alt="Carbon Logo"
        />
        <span className="w-full font-bold pl-2 text-lg">Carbon ERP</span>
      </>
    );
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="og:title" content="Nextra: the next docs builder" />
    </>
  ),
};

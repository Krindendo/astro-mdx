import type { SiteConfig } from "../types";
import { getAbsoluteUrl, getBaseUrl } from "../lib/utils";

export const siteConfig: SiteConfig = {
  name: "Astro MDX",
  description: "Tamplete for using MDX with Astro.",
  url: getBaseUrl(),
  ogImage: getAbsoluteUrl("/og.jpg"),
  links: {
    github: "https://github.com/Krindendo/astro-mdx",
  },
};

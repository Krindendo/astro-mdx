import type { MainNavItem, SidebarNavItem } from "../types";

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNavDocs: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [{ title: "Documentation", href: "/docs" }],
  sidebarNavDocs: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "State Hooks",
          href: "/docs/state-hooks",
        },
        {
          title: "Context Hooks",
          href: "/docs/context-hooks",
        },
      ],
    },
  ],
};

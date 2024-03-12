import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react({ experimentalReactChildren: true }),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
      gfm: false,
    }),
  ],
});

/*

        [
          rehypePrettyCode,
          {
            theme: "dark-plus",
            onVisitLine(node) {
              // Prevent lines from collapsing in `display: grid` mode, and allow empty
              // lines to be copy/pasted
              if (node.children.length === 0) {
                node.children = [{ type: "text", value: " " }];
              }
            },
            onVisitHighlightedLine(node) {
              node.properties.className ??= [];
              node.properties.className.push("line--highlighted");
            },
            onVisitHighlightedWord(node) {
              node.properties.className = ["word--highlighted"];
            },
          },
        ],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["subheading-anchor"],
              ariaLabel: "Link to section",
            },
          },
        ],
*/

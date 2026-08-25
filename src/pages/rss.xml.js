import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

// Auto-generated from the same `blog` content collection every other page
// reads from — add a post's .md file and it shows up here on the next
// build automatically, no separate list to maintain.
export async function GET(context) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const [aboutEntry] = await getCollection("about");
  const about = aboutEntry?.data;

  return rss({
    title: `${about?.name ?? "Sudharsan Balaji"} — Field Notes`,
    description: about?.tagline ?? "Field notes on AI, business, and product management.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>en</language>`,
  });
}

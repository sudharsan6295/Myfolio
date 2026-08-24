import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ---------------------------------------------------------------------------
// Blog posts — one Markdown file per post in src/content/blog/*.md
// ---------------------------------------------------------------------------
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // Keep this list in sync with the categories mentioned in README.md
      // AND the `categories` array in src/pages/blog/index.astro (filter
      // buttons + subscribe-by-category checkboxes both read from there).
      category: z.enum([
        'AI',
        'Business',
        'AI Product Management',
        'Personal Finance',
        'Aquariums & Fishkeeping',
      ]),
      tags: z.array(z.string()).default([]),
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    }),
});

// ---------------------------------------------------------------------------
// Side projects / MVPs — one Markdown file per project in src/content/projects/*.md
// ---------------------------------------------------------------------------
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      status: z.enum(['live', 'prototype', 'archived']),
      startDate: z.coerce.date(),
      stack: z.array(z.string()).default([]),
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      links: z
        .object({
          demo: z.string().url().optional(),
          repo: z.string().url().optional(),
          writeup: z.string().url().optional(),
        })
        .default({}),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      // Lower sorts first among featured projects; ties broken by startDate.
      order: z.number().default(0),
    }),
});

// ---------------------------------------------------------------------------
// About Me — a single entry in src/content/about/about.md
// ---------------------------------------------------------------------------
const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      tagline: z.string(),
      location: z.string().optional(),
      email: z.string().email().optional(),
      resumeUrl: z.string().optional(),
      // Shown as a small avatar in the top nav, next to your name. Optional —
      // without it, the nav shows your initials instead. To add one, put an
      // image file next to about.md (e.g. src/content/about/me.jpg) and set
      // photo: "./me.jpg" in the frontmatter.
      photo: image().optional(),
      photoAlt: z.string().optional(),
      social: z
        .object({
          linkedin: z.string().url().optional(),
          github: z.string().url().optional(),
          twitter: z.string().url().optional(),
        })
        .default({}),
      // What to focus on right now — shown in the "At a glance" panel.
      currently: z.string().optional(),
      // Short tags, e.g. "AI Product Strategy" — shown as chips.
      focusAreas: z.array(z.string()).default([]),
      // Short tags, e.g. "Python" — shown as chips.
      tools: z.array(z.string()).default([]),
      // Short tags, e.g. "Professional Scrum Master (PSM)" — shown as chips.
      certifications: z.array(z.string()).default([]),
      // Academic history, most recent first.
      education: z
        .array(
          z.object({
            degree: z.string(),
            institution: z.string(),
            year: z.string(),
          }),
        )
        .default([]),
      // A handful of working principles — shown as their own panel.
      principles: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
          }),
        )
        .default([]),
      experience: z
        .array(
          z.object({
            company: z.string(),
            role: z.string(),
            start: z.string(),
            end: z.string(), // e.g. "Present"
            location: z.string().optional(),
            bullets: z.array(z.string()).default([]),
          }),
        )
        .default([]),
    }),
});

export const collections = { blog, projects, about };

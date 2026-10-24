import { defineCollection, defineConfig } from "@content-collections/core";
import {
  affiliateLinkSchema,
  authorSchema,
  categorySchema,
  comparisonSchema,
  glossaryTermSchema,
  guideSchema,
  softwareSchema,
  vendorSchema,
} from "./src/content/schemas.ts";

// Content lives in /content as YAML (structured data) and MDX (long form). Schemas and guards
// are in src/content. Run `pnpm content:validate`: Content Collections only reports schema
// errors as events, so the validation script turns every event into a failed build.

/** The file name is the slug, so URLs and references cannot drift apart. */
function slugMatchesFile<T extends { slug: string; _meta: { path: string } }>(doc: T): T {
  if (doc.slug !== doc._meta.path) {
    throw new Error(`Slug „${doc.slug}“ passt nicht zum Dateinamen „${doc._meta.path}“.`);
  }
  return doc;
}

const vendors = defineCollection({
  name: "vendors",
  directory: "content/vendors",
  include: "*.yaml",
  parser: "yaml",
  schema: vendorSchema,
  transform: slugMatchesFile,
});

const categories = defineCollection({
  name: "categories",
  directory: "content/categories",
  include: "*.yaml",
  parser: "yaml",
  schema: categorySchema,
  transform: slugMatchesFile,
});

const software = defineCollection({
  name: "software",
  directory: "content/software",
  include: "*.yaml",
  parser: "yaml",
  schema: softwareSchema,
  transform: slugMatchesFile,
});

const authors = defineCollection({
  name: "authors",
  directory: "content/authors",
  include: "*.yaml",
  parser: "yaml",
  schema: authorSchema,
  transform: slugMatchesFile,
});

const comparisons = defineCollection({
  name: "comparisons",
  directory: "content/comparisons",
  include: "*.yaml",
  parser: "yaml",
  schema: comparisonSchema,
  transform: slugMatchesFile,
});

const affiliateLinks = defineCollection({
  name: "affiliateLinks",
  directory: "content/affiliate",
  include: "*.yaml",
  parser: "yaml",
  schema: affiliateLinkSchema,
});

const guides = defineCollection({
  name: "guides",
  directory: "content/guides",
  include: "*.mdx",
  parser: "frontmatter",
  schema: guideSchema,
  transform: slugMatchesFile,
});

const glossary = defineCollection({
  name: "glossary",
  directory: "content/glossary",
  include: "*.yaml",
  parser: "yaml",
  schema: glossaryTermSchema,
  transform: slugMatchesFile,
});

export default defineConfig({
  content: [vendors, categories, software, authors, comparisons, affiliateLinks, guides, glossary],
});

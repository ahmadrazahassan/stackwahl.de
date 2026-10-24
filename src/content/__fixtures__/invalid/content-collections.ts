import { defineCollection, defineConfig } from "@content-collections/core";
import { categorySchema } from "../../schemas.ts";

// Test fixture: a category file that violates the schema must fail `content:validate`.
const categories = defineCollection({
  name: "categories",
  directory: "categories",
  include: "*.yaml",
  parser: "yaml",
  schema: categorySchema,
});

export default defineConfig({ content: [categories] });

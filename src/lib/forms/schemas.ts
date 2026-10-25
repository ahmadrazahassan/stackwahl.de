import { z } from "zod";

// Shared form schemas: the same rules run in the browser and in the server action (Section 8).
// Messages are German and are shown next to the field via aria-describedby.

export const CONTACT_TOPICS = {
  korrektur: "Hinweis auf eine falsche oder veraltete Angabe",
  frage: "Frage zur Methodik oder zu einem Programm",
  anbieter: "Anfrage als Softwareanbieter",
  sonstiges: "Sonstiges",
} as const;

export type ContactTopic = keyof typeof CONTACT_TOPICS;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Bitte geben Sie Ihren Namen ein.")
    .max(100, "Bitte kürzen Sie den Namen."),
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  topic: z.enum(Object.keys(CONTACT_TOPICS) as [ContactTopic, ...ContactTopic[]], {
    error: "Bitte wählen Sie ein Thema.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Bitte schreiben Sie mindestens 20 Zeichen.")
    .max(5000, "Bitte fassen Sie sich kürzer (höchstens 5.000 Zeichen)."),
  /** Honeypot: hidden from people, must stay empty. */
  firma: z.string().max(0).optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  firma: z.string().max(0).optional().default(""),
});

export type FormState<Field extends string = string> = {
  status: "idle" | "ok" | "error";
  message?: string;
  fieldErrors?: Partial<Record<Field, string>>;
  values?: Partial<Record<Field, string>>;
};

/** First message per field, in a shape the form components can show. */
export function fieldErrors<Field extends string>(
  error: z.ZodError,
): Partial<Record<Field, string>> {
  const out: Partial<Record<Field, string>> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]) as Field;
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

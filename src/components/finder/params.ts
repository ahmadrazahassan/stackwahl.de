import {
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsStringLiteral,
} from "nuqs";
import { BUDGETS, MUSTS, NEEDS, PROFITS, type FinderAnswers } from "@/lib/finder";

// URL state of the Software-Finder (German keys, shareable). No personal data is stored.
export const finderParsers = {
  bedarf: parseAsArrayOf(parseAsStringLiteral(NEEDS)).withDefault([]),
  gewinn: parseAsStringLiteral(PROFITS).withDefault("unklar"),
  klein: parseAsBoolean.withDefault(false),
  datev: parseAsBoolean.withDefault(false),
  budget: parseAsStringLiteral(BUDGETS).withDefault("egal"),
  muss: parseAsArrayOf(parseAsStringLiteral(MUSTS)).withDefault([]),
};

export const stepParser = parseAsInteger.withDefault(1);

export const serializeFinder = createSerializer(finderParsers);

export type FinderState = {
  bedarf: FinderAnswers["needs"];
  gewinn: FinderAnswers["gewinn"];
  klein: boolean;
  datev: boolean;
  budget: FinderAnswers["budget"];
  muss: FinderAnswers["musts"];
};

export function toAnswers(state: FinderState): FinderAnswers {
  return {
    needs: state.bedarf,
    gewinn: state.gewinn,
    kleinunternehmer: state.klein,
    datev: state.datev,
    budget: state.budget,
    musts: state.muss,
  };
}

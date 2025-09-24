import { fixtures } from "@/data/fixtures";

export function getAcronym(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0]! + words[1]![0]!).toUpperCase();
}

export interface TeamInfo {
  name: string;
  acronym: string;
}

const extras = [
  "Abuja Heat",
  "PH Sharks",
  "Accra United",
  "Lagos FC",
  "Kano Kings",
  "Benin Bulls",
  "Enugu XI",
  "Ibadan XI",
  "PH Clippers",
  "Jos Giants",
  "Abuja Stars",
  "Okoye",
  "Adeyemi",
];

export const teams: TeamInfo[] = Array.from(
  new Set([
    ...fixtures.flatMap((f) => [f.home, f.away]),
    ...extras,
  ]),
).map((name) => ({ name, acronym: getAcronym(name) }));

export type Sport = "Football" | "Basketball" | "Tennis" | "Cricket" | "Rugby";

export interface Fixture {
  id: string;
  sport: Sport;
  home: string;
  away: string;
  date: string; // e.g. Today, Tomorrow, Sat
  time: string; // e.g. 18:00
  league: string;
}

export const fixtures: Fixture[] = [
  { id: "f1", sport: "Football", home: "Lagos FC", away: "Abuja Stars", date: "Today", time: "18:00", league: "Premier League" },
  { id: "f2", sport: "Basketball", home: "Kano Kings", away: "PH Clippers", date: "Today", time: "19:30", league: "NBP" },
  { id: "f3", sport: "Tennis", home: "Okoye", away: "Adeyemi", date: "Tomorrow", time: "14:00", league: "ATP Abuja" },
  { id: "f4", sport: "Cricket", home: "Enugu XI", away: "Ibadan XI", date: "Tomorrow", time: "11:00", league: "NCL" },
  { id: "f5", sport: "Rugby", home: "Benin Bulls", away: "Jos Giants", date: "Sat", time: "16:00", league: "NRL" },
  { id: "f6", sport: "Football", home: "Accra United", away: "Lagos FC", date: "Sun", time: "20:00", league: "Champions" },
];

export const sportsFilters: ("All" | Sport)[] = ["All", "Football", "Basketball", "Tennis", "Cricket", "Rugby"];

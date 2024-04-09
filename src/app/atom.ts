import { atom } from "jotai";
export const weatherDescriptionAtom = atom({
  main: { temp: 222 },
  visibility: 1000,
  weather: [{ description: "" }],
});

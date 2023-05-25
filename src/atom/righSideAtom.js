import { atom } from "recoil";
export const rightSideState = atom({
  key: "rightSideState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

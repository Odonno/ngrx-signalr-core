import { Feed } from "./models";

export function sortByCreatedAtAsc(a: Feed, b: Feed) {
  return a.createdAt > b.createdAt ? 1 : -1;
}
export function sortByCreatedAtDesc(a: Feed, b: Feed) {
  return a.createdAt < b.createdAt ? 1 : -1;
}

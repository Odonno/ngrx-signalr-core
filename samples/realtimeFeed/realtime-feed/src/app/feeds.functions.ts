import { Feed } from './models';

export function sortByCreatedAtAsc(a: Feed, b: Feed) {
    return a.createdAt > b.createdAt ? 1 : -1;
}
export function sortByCreatedAtDesc(a: Feed, b: Feed) {
    return a.createdAt < b.createdAt ? 1 : -1;
}

// export const sortByCreatedAtAsc = (a: Feed, b: Feed) => {
//     return a.createdAt > b.createdAt ? 1 : -1;
// }
// export function sortByCreatedAtDesc (a: Feed, b: Feed) {
//     //return 10;
//     //console.log(a.createdAt > b.createdAt ? 1 : -1)
//     return a.createdAt > b.createdAt ? -1 : 1;
// }

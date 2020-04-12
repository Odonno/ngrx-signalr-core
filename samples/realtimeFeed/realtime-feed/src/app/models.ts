export type Feed = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
};

export type LoadFeedsResponse = {
    feeds: Feed[];
    canLoadMore: boolean;
}
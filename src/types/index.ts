import View from '../core/view';

export interface NewsStore {
  getAllFeeds: () => NewsFeed[];
  getFeed: (position: number) => NewsFeed;
  setFeeds: (feeds: NewsFeed[]) => void;
  makeRead: (id: number) => void;
  hasFeeds: boolean;
  currentPage: number;
  numberOfFeed: number;
  nextPage: number;
  prevPage: number;
}

export interface News {
  readonly id: number; //readonly: 코드 내에서 다른 값으로 대체하지 못하게 하는 지시어
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

export interface NewsFeed extends News {
  readonly points: number;
  readonly comments_count: number;
  read?: boolean; //?를 붙이면 선택속성이됨
}

export interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

export interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

export interface RouteInfo {
  path: string;
  page: View;
  params: RegExp | null;
}

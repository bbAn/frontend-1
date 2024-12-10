import View from '../core/view';

export interface Store {
  feeds: NewsFeed[];
  currentPage: number; //세미클론으로 마무리함
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

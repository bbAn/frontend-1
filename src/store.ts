import { NewsFeed, NewsStore } from './types';

export class Store implements NewsStore {
  private feeds: NewsFeed[]; // private: 노출 되지 않도록함
  private _currentPage: number; // 내부에서만 사용하는 경우 이름이 겹치지 않도록 _ 사용

  constructor() {
    this.feeds = [];
    this._currentPage = 1;
  }

  // 내부에서는 함수로 작동하지만 class 외부에서는 속성처럼 보이게 하는 getter, setter
  // 잘못된 값으로 세팅하거나 특정한 범위 내의 값으로만 한정시킬수 있도록 방어할 수 있음

  // 외부로부터 데이터를 세팅
  get currentPage() {
    return this._currentPage;
  }

  // 대입문
  set currentPage(page: number) {
    // if(page <=0) return; 방어코드 예시
    this._currentPage = page;
  }

  get nextPage(): number {
    return this._currentPage + 1;
  }

  get prevPage(): number {
    return this._currentPage > 1 ? this._currentPage - 1 : 1;
  }

  get numberOfFeed(): number {
    return this.feeds.length;
  }

  get hasFeeds(): boolean {
    return this.feeds.length > 0;
  }

  getFeed(position: number): NewsFeed {
    return this.feeds[position];
  }

  getAllFeeds(): NewsFeed[] {
    return this.feeds;
  }

  setFeeds(feeds: NewsFeed[]): void {
    this.feeds = feeds.map((feed) => ({
      ...feed,
      read: false
    }));
  }

  makeRead(id: number): void {
    const feed = this.feeds.find((feeds: NewsFeed) => feed.id === id);

    if (feed) {
      feed.read = true;
    }
  }
}

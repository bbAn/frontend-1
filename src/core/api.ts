import { NewsFeed, NewsDetail } from '../types';

export default class Api {
  xhr: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    //초기화 해주는 함수 생성자
    this.xhr = new XMLHttpRequest();
    this.url = url;
  }

  getRequestWithXHR<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
    this.xhr.open('GET', this.url); //해커뉴스 API를 가져온다
    this.xhr.addEventListener('load', () => {
      // 콜백함수에 들어있기 때문에 리턴할 대상이 없는데
      // cb함수를 인자로 받아서 데이터를 넘겨주는 방식
      cb(JSON.parse(this.xhr.response) as AjaxResponse); //JSON형태의 응답값을 객체로 바꿈 (배열)
    });

    this.xhr.send(); //데이터가 들어옴
  }

  getRequestWithPromise<AjaxResponse>(cb: (data: AjaxResponse) => void): void {
    // XHR의 여러가지 단점을 보완하는 promise 기반의 api
    fetch(this.url)
      // then 메소드를 사용하여 콜벡 헬의 뎁스를 줄임
      .then((response) => response.json()) // 응답이 왔을때 json데이터를 비동기적으로 객체로 바꿔주는 기능 제공. 기존의 JSON.parse는 동기적으로 작동하여 데이터가 크면 ui가 멈추는 문제가 있음
      .then(cb) // 응답을 받은  콜백을 넣어 데이터를 전달
      .catch(() => {
        // 에러처리
        console.error('데이터를 불러오지 못했습니다.');
      });
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getDataWithXHR(cb: (data: NewsFeed[]) => void): void {
    //제네릭 문법: <>를 사용. 호출하는 쪽에서 유형을 명시해주면 그 유형을 그대로 반환유형으로 사용함
    return this.getRequestWithXHR<NewsFeed[]>(cb); // view에서 콜백을 받을 수 있도록 넘겨줌
  }

  getDataWithPromise(cb: (data: NewsFeed[]) => void): void {
    //제네릭 문법: <>를 사용. 호출하는 쪽에서 유형을 명시해주면 그 유형을 그대로 반환유형으로 사용함
    return this.getRequestWithPromise<NewsFeed[]>(cb); // view에서 콜백을 받을 수 있도록 넘겨줌
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getDataWithXHR(cb: (data: NewsDetail) => void): void {
    return this.getRequestWithXHR<NewsDetail>(cb); // view에서 콜백을 받을 수 있도록 넘겨줌
  }

  getDataWithPromise(cb: (data: NewsDetail) => void): void {
    return this.getRequestWithPromise<NewsDetail>(cb); // view에서 콜백을 받을 수 있도록 넘겨줌
  }
}

import { NewsFeed, NewsDetail } from '../types';

export default class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
     //초기화 해주는 함수 생성자
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  getRequest<AjaxResponse>(): AjaxResponse {
    this.ajax.open('GET', this.url, false); //해커뉴스 API를 가져온다 마지막에 boolean값은 가져오는 데이터를 동기/비동기 처리에 대한 옵션
    this.ajax.send(); //데이터가 들어옴

    return JSON.parse(this.ajax.response) as AjaxResponse; //JSON형태의 응답값을 객체로 바꿈 (배열)
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(): NewsFeed[] {
    //제네릭 문법: <>를 사용. 호출하는 쪽에서 유형을 명시해주면 그 유형을 그대로 반환유형으로 사용함
    return this.getRequest<NewsFeed[]>();
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }

  getData(): NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}

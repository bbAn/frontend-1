interface Store {
  currentPage: number; //세미클론으로 마무리함
  feeds: NewsFeed[];
}

//중복되는 타입들을 모아둠
interface News {
  readonly id: number; //readonly: 코드 내에서 다른 값으로 대체하지 못하게 하는 지시어
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  readonly points: number;
  read?: boolean; //?를 붙이면 선택속성이됨
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

interface RouteInfo {
  path: string;
  page: View;
}

const ajax: XMLHttpRequest = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'; //해커뉴스 API
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'; //해커뉴스 상세 내용 게시글 아이디는 @id로 마킹된 상태

//객체는 Type Aliases, interface를 통해서 타입을 지정할 수 있다
const store: Store = {
  currentPage: 1,
  feeds: []
};

class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    //초기화 해주는 함수 생성자
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  //protected: getRequest 메소드 이름 앞에 붙이면 외부로 인스턴스 객체로 등장하지 않아 호출할 수 없게 됨
  getRequest<AjaxResponse>(): AjaxResponse {
    this.ajax.open('GET', this.url, false); //해커뉴스 API를 가져온다 마지막에 boolean값은 가져오는 데이터를 동기/비동기 처리에 대한 옵션
    this.ajax.send(); //데이터가 들어옴

    return JSON.parse(this.ajax.response); //JSON형태의 응답값을 객체로 바꿈 (배열)
  }
}

class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    //제네릭 문법: <>를 사용. 호출하는 쪽에서 유형을 명시해주면 그 유형을 그대로 반환유형으로 사용함
    return this.getRequest<NewsFeed[]>();
  }
}

class NewsDetailApi extends Api {
  getData(): NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}

abstract class View {
  private template: string;
  private renderTemplate: string;
  private container: HTMLElement;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const containerElement = document.getElementById(containerId);

    if (!containerElement) {
      throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.';
    }

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  //타입가드: 어떤 유형의 값이 2가지가 들어온 케이스에서 그중의 한가지가 null인 케이스를 체크해라
  protected updateView(): void {
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }

  protected getHtml(): string {
    const snapshot = this.htmlList.join('');
    this.clearHtmlList();
    return snapshot;
  }

  protected setTemplateDate(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  private clearHtmlList(): void {
    this.htmlList = [];
  }

  abstract render(): void; //추상 메소드 앞에 abstract를 붙임
}

class Router {
  routeTable: RouteInfo[];
  defalutRoute: RouteInfo | null;

  constructor() {
    window.addEventListener('hashchange', this.route.bind(this));

    this.routeTable = [];
    this.defalutRoute = null;
  }

  setDefaultPage(page: View): void {
    this.defalutRoute = { path: '', page };
  }

  addRoutePath(path: string, page: View): void {
    this.routeTable.push({ path, page });
  }

  route() {
    const routePath = location.hash;

    if (routePath === '' && this.defalutRoute) {
      this.defalutRoute.page.render();
    }

    for (const routeInfo of this.routeTable) {
      if (routePath.indexOf(routeInfo.path) >= 0) {
        routeInfo.page.render();
        break;
      }
    }
  }
}

class NewsFeedView extends View {
  private api: NewsFeedApi;
  private feeds: NewsFeed[];
  constructor(containerId: string) {
    let template: string = `
    <div class="bg-gray-600 min-h-screen">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/{{__prev_page__}}" class="text-gray-500">
              Previous
            </a>
            <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
              Next
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 text-2xl text-gray-700">
      {{__news_feed__}}
    </div>
  </div>
  `;

    super(containerId, template);

    this.api = new NewsFeedApi(NEWS_URL); //클래스 인스턴스를 만들어줌
    this.feeds = store.feeds;
    // template를 사용해 분리하면 구조를 명확하게 파악 수 있고 복잡도를 줄일 수 있음

    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData();
      this.makeFeeds();
      //makeFeeds()를 store.feeds, newsFeed에 연속으로 넣을 수 있는 문법
    }
  }

  render(): void {
    store.currentPage = Number(location.hash.substring(7) || 1);
    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
      const { id, title, comments_count, user, points, time_ago, read } = this.feeds[i];
      this.addHtml(`
        <div class="p-6 ${
          read ? 'bg-red-500' : 'bg-white'
        } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${id}">${title}</a>
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${user}</div>
            <div><i class="fas fa-heart mr-1"></i>${points}</div>
            <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
          </div>
        </div>
      </div>
      `);
    }

    this.setTemplateDate('news_feed', this.getHtml()); //.join 배열 요소안의 문자열을 하나의 문자열로 연결 시켜주는 함수. , 구분자를 쓸수 있음
    this.setTemplateDate('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    this.setTemplateDate('next_page', String(store.currentPage + 1));

    this.updateView();
  }

  private makeFeeds(): void {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }
}

class NewsDetailView extends View {
  constructor(containerId: string) {
    let template = `
  <div class="bg-gray-600 min-h-screen pb-8">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/{{__currentPage__}}" class="text-gray-500">
              <i class="fa fa-times"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="h-full border rounded-xl bg-white m-6 p-4 ">
      <h2>{{__title__}}</h2>
      <div class="text-gray-400 h-20">
        {{__content__}}
      </div>

      {{__comments__}}

    </div>
  </div>
`;
    super(containerId, template);
  }

  render() {
    //hashchange: 해쉬가 바뀌었을 때 발생하는 이벤트
    //window 객체에서 발생
    const id = location.hash.substring(7); //location 객체는 브라우저가 기본으로 제공. 주소와 관련된 다양한 정보 제공
    const api = new NewsDetailApi(CONTENT_URL.replace('@id', id)); //@id로 마킹해둔것을 실제 id로 바꿔줌
    const newsDetail: NewsDetail = api.getData();

    for (let i = 0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }
    //목록 화면을 상세 내용으로 바꿔줌
    this.setTemplateDate('comments', this.makeComment(newsDetail.comments));
    this.setTemplateDate('currentPage', String(store.currentPage));
    this.setTemplateDate('title', newsDetail.title);
    this.setTemplateDate('content', newsDetail.content);

    this.updateView();
  }

  makeComment(comments: NewsComment[]): string {
    for (let i = 0; i < comments.length; i++) {
      const comment: NewsComment = comments[i];

      this.addHtml(`
        <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>
      `);

      if (comment.comments.length > 0) {
        this.addHtml(this.makeComment(comment.comments));
        //재귀 호출: 함수가 자기 자신을 호출하는 것. 끝을 알 수 없는 구조에서 유용하게 사용할 수 있음
      }
    }

    return this.getHtml();
  }
}

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();

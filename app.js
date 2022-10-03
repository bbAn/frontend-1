
const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'; //해커뉴스 API
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'; //해커뉴스 상세 내용
const store = {
  currentPage: 1,
};

function getData(url) {
  ajax.open('GET', url, false); //해커뉴스 API를 가져온다
  ajax.send();

  return JSON.parse(ajax.response);

}

//글 목록 화면을 재활용하기위해 코드를 묶음
function newsFeed() {
  
  const newsFeed = getData(NEWS_URL);
  const ul = document.createElement('ul');

  //글 목록 화면
  //DOM API 사용하는 부분을 개선함
  const newsList = [];
  newsList.push('<ul>');

  for(let i = (store.currentPage -1) * 10; i < store.currentPage * 10; i++) {
    newsList.push( `
      <li>
        <a href="#/show/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `);
  }

  newsList.push('</ul>');
  newsList.push(`
    <div>
      <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
      <a href="#/page/${store.currentPage < 3 ? store.currentPage + 1 : store.currentPage}">다음 페이지</a>
    </div>
  `);

  container.innerHTML = newsList.join('');
  //.join 배열 요소안의 문자열을 하나의 문자열로 연결 시켜주는 함수. , 구분자를 쓸수 있음
}

//글 내용 화면
function newsDetail() {
  //hashchange: 해쉬가 바뀌었을 때 발생하는 이벤트
  //window 객체에서 발생

  const id = location.hash.substring(7); //location 객체는 브라우저가 기본으로 제공. 주소와 관련된 다양한 정보 제공
  const newContent = getData(CONTENT_URL.replace('@id', id));

  //목록 화면을 상세 내용으로 바꿔줌
  container.innerHTML = `
    <h1>${newContent.title}</h1>
    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
};

function router() {
  const routePath = location.hash;

  if (routePath === '') {
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routePath.substring(7));

    newsFeed();
  } else {
    newsDetail();
  }
  //목록으로의 값은 #인데 location.hash에 #이 들어왔을텐데 참이 된 이유는 #만 있으면 빈 값을 반환함
}

window.addEventListener('hashchange', router);

router();
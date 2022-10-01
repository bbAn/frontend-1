
const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'; //해커뉴스 API
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'; //해커뉴스 상세 내용

function getData(url) {
  ajax.open('GET', url, false); //해커뉴스 API를 가져온다
  ajax.send();

  return JSON.parse(ajax.response);

}


const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

window.addEventListener('hashchange', function() {
  //hashchange: 해쉬가 바뀌었을 때 발생하는 이벤트
  //window 객체에서 발생

  const id = location.hash.substring(1); //location 객체는 브라우저가 기본으로 제공. 주소와 관련된 다양한 정보 제공

  const newContent = getData(CONTENT_URL.replace('@id', id));
  const title = document.createElement('h1');

  title.innerHTML =  newContent.title;
  
  content.appendChild(title);
});

for(let i = 0; i < 10; i++) {
  const div = document.createElement('div');

  div.innerHTML = `
  <li>
    <a href="#${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
    </a>
  </li>
  `;

  // ul.appendChild(div.children[0]); 이렇게 써도 됨
  ul.appendChild(div.firstElementChild);

}

container.appendChild(ul);
container.appendChild(content);
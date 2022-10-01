const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL =  'https://api.hnpwa.com/v0/news/1.json'; //해커뉴스 API
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'; //해커뉴스 상세 내용

ajax.open('GET', NEWS_URL, false); //해커뉴스 API를 가져온다
ajax.send();

const newsFeed = JSON.parse(ajax.response);
const ul = document.createElement('ul');

window.addEventListener('hashchange', function() {
  //hashchange: 해쉬가 바뀌었을 때 발생하는 이벤트
  //window 객체에서 발생

  const id = location.hash.substring(1);//location 객체는 브라우저가 기본으로 제공. 주소와 관련된 다양한 정보 제공

  ajax.open('GET', CONTENT_URL.replace('@id', id), false);
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  const title = document.createElement('h1');

  title.innerHTML = newsContent.title;

  content.appendChild(title);
});

for(let i = 0; i < 10; i++) {
  const li = document.createElement('li');
  const a = document.createElement('a');
 
  a.href = `#${newsFeed[i].id}`;
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

  li.appendChild(a);
  ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);

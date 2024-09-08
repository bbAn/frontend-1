import Router from './core/router'
import { NewsFeedView, NewsDetailView } from './page'
import { Store } from './types'

//객체는 Type Aliases, interface를 통해서 타입을 지정할 수 있다
const store: Store = {
  currentPage: 1,
  feeds: []
};

declare global {
  interface Window {
    store: Store
  }
}

window.store = store;

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();

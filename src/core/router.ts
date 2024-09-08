import { RouteInfo } from '../types/';
import View from './view';

export default class  Router {
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
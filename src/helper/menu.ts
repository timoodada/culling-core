import { Route } from '../models';

interface Menu {
  path: string;
  title: string;
  children: this[];
}

export function formatDocMenu(routes: Route[], prefix = '/'): Menu[] {
  routes = routes.slice(0);
  const menu: Menu[] = [];
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].path.indexOf(prefix) === 0 && routes.every(v => routes[i].path.indexOf(v.path) === -1)) {
      menu.push({
        path: routes[i].path,
        title: String(routes[i].front.title || ''),
        children: formatDocMenu(routes.slice(0), routes[i].path),
      });
      routes.splice(i, 1);
      i--;
    }
  }
  return menu;
}

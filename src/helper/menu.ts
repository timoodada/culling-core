import { CullingRoute } from '../models';

interface Menu extends CullingRoute{
  title: string;
  children: this[];
}

export function formatDocMenu(routes: CullingRoute[], prefix = '/'): Menu[] {
  routes = routes.slice(0);
  const menu: Menu[] = [];
  for (let i = 0; i < routes.length; i++) {
    if (
      routes[i].path.indexOf(prefix) === 0 &&
      routes.filter(v => v !== routes[i]).every(v => routes[i].path.indexOf(v.path) === -1)
    ) {
      const item = routes[i];
      routes.splice(i, 1);
      i--;
      menu.push({
        path: item.path,
        title: String(item.front.title || ''),
        children: formatDocMenu(routes.slice(0), item.path),
        front: item.front,
        data: item.data,
        exact: item.exact,
      });
    }
  }
  return menu;
}

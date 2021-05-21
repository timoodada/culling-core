import { Front } from './components';
import { Node as HNode } from 'hast-util-to-html/lib/types';

interface Route {
  exact: boolean;
  path: string;
  data: {
    hast: HNode | HNode[];
    front: Front;
  };
}
const routes: Route[] = [];
export default routes;

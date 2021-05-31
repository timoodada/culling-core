import { Node } from 'unist-util-visit';
import { Front } from './components';

interface Route {
  exact: boolean;
  path: string;
  front: Front;
  data: () => Promise<Node>;
}
const routes: Route[] = [];
export default routes;

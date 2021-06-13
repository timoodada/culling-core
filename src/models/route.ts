import { Front } from '../components';
import { Node } from 'unist-util-visit';

export interface CullingRoute {
  exact: boolean;
  path: string;
  front: Front;
  data: () => Promise<Node>;
}

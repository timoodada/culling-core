interface Route {
  exact: boolean;
  path: string;
  data: { hast: any; front: { [prop: string]: string | number | boolean }; };
}
const routes: Route[] = [];
export default routes;

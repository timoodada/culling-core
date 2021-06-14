import React, { useEffect, useState } from 'react';
import { Route, Switch, useLocation, Link } from 'react-router-dom';
import { routes, MdWrapper, loadModules, formatDocMenu } from '../lib';
import { Layout } from './components/layout';

const defaultMenu = formatDocMenu(routes);

const App = () => {
  const location = useLocation();
  const [combinedRoutes, setCombinedRoutes] = useState(defaultMenu);
  useEffect(() => {
    loadModules('/api/modules', './App').then(res => {
      const arr = res.reduce((prev, current) => {
        return prev.concat(current.default);
      }, []);
      const combined = formatDocMenu(routes.concat(arr));
      setCombinedRoutes(combined);
    });
  }, []);
  return (
    <Layout
      nav={
        <ul>
          {
            combinedRoutes.map((item, key) => (
              <li key={key}>
                <Link to={item.path}>{item.title}</Link>
              </li>
            ))
          }
        </ul>
      }
    >
      <Switch location={location}>
        {
          combinedRoutes.map((Item) => {
            return (
              <Route
                exact={Item.exact}
                path={Item.path}
                key={Item.path}
                render={props => {
                  return (
                    <MdWrapper front={Item.front} data={Item.data} />
                  );
                }}
              />
            );
          })
        }
      </Switch>
    </Layout>
  );
};

export default App;

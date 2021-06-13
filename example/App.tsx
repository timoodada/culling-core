import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { routes, MdWrapper, loadModule } from '../lib';

loadModule('/api/modules', './App').then(res => {
  console.log(res);
});

const App = () => {
  const location = useLocation();
  useEffect(() => {
    //
  }, []);
  return (
    <>
      <Switch location={location}>
        {
          routes.map((Item) => {
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
    </>
  );
};

export default App;

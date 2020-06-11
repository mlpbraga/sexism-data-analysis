import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Sign from './pages/Sign';

import Main from './pages/Main';

// import CreatePoint from './pages/CreatePoint';

const Routes = () => {
  return (
    <BrowserRouter basename="sexism-research">
      <Route component={Home} path='/' exact />
      <Route component={About} path='/about' exact />
      {/* TODO: fazer private route */}
      <Route component={Sign} path='/sign' exact />
      <Route component={Main} path='/main' exact />

      {/* <Route component={CreatePoint} path='/create-point' /> */}
    </BrowserRouter>
  );
}

export default Routes;

import React from 'react';
import {
  RouteProps as ReactRouterProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../context/auth';

interface RouteProps extends ReactRouterProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}
const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{ pathname: isPrivate ? '/' : '/home', state: location }}
          />
        );
      }}
    />
  );
};

export default Route;

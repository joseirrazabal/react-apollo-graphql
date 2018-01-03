import React from 'react';
import {Route, Link} from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem} from 'reactstrap';
import routes from './routes';

const findRouteName = url => routes[url];

const getPaths = (pathname) => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

// const BreadcrumbsItem = ({...rest, match}) => {
const BreadcrumbsItem = (props) => {
  const routeName = findRouteName(props.match.url);
  if (routeName) {
    return (
      props.match.isExact ?
        (
          <BreadcrumbItem active>{routeName}</BreadcrumbItem>
        ) :
        (
          <BreadcrumbItem>
            <Link to={props.match.url || ''}>
              {routeName}
            </Link>
          </BreadcrumbItem>
        )
    );
  }
  return null;
};

// const Breadcrumbs = ({...rest, location : {pathname}, match}) => {
//   const paths = getPaths(pathname);
const Breadcrumbs = (props) => {
  const paths = getPaths(props.location.pathname);
  const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem}/>);
  return (
    <Breadcrumb>
      {items}
    </Breadcrumb>
  );
};

export default props => (
  <div>
    <Route path="/:path" component={Breadcrumbs} {...props} />
  </div>
);

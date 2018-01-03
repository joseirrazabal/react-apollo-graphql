import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Post from './Post';
import Posts from './Posts';

const AsyncPostsRoute = () =>
  <div>
    <Switch>
      <Route path="/posts/:id" component={Post} />
      <Route path="/posts" exact component={Posts} />
    </Switch>
  </div>;

export default AsyncPostsRoute;

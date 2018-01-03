/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { shape, bool, object } from 'prop-types';
import { gql, graphql } from 'react-apollo';
import Link from 'react-router-dom/Link';
import Helmet from 'react-helmet';

// import POSTS_LIST_QUERY from './postList.graphql';

class Posts extends Component {
  render() {
    const { data: { loading, postList } } = this.props;
    if (loading) {
      return <span>Loading...</span>;
    }
    return (
      <div>
        <Helmet title="Posts" />
        <div>
          <ul>
            {postList.posts.map(post =>
              <li key={post.id}>
                <div>
                  <h3>
                    {post.title}
                  </h3>
                  <p>AsyncPostsRoute
                    {post.body}
                  </p>
                  <hr />
                  <Link to={`/posts/${post.id}`}>Read more...</Link>
                </div>
              </li>,
            )}
          </ul>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  data: shape({
    loading: bool,
    postList: object,
  }).isRequired,
};
export const POSTS_LIST_QUERY = gql`
  query {
    postList {
      posts {
        id
        title
        body
        userId
      }
    }
  }
`;
export default graphql(POSTS_LIST_QUERY)(Posts);
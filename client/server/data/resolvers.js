/* eslint-disable no-unused-vars */
import posts from './mockData';

const resolveFunctions = {
  PostList: {
    posts() {
      return posts;
    },
  },
  Query: {
    postList() {
      return true;
    },
    singlePost(_, args, ctx) {
      return posts[args.id];
    },
  },
};

export default resolveFunctions;

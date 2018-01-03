const schema = `
  type Post {
    # the post's id
    id: Int!
    # the title of the post
    title: String!
    # the id of the author
    userId: Int
    # the post content
    body: String!
  }
  # 100 post objects from JSONplaceholder
  type PostList {
    posts: [Post]
  }
  # the schema allows the following query:
  type Query {
    postList: PostList
    singlePost(id: Int!): Post
  }

  schema {
    query: Query
  }
`;

export default schema;

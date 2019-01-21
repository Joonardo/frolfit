import * as Koa from 'koa';
import * as jwt from 'koa-jwt';
import { ApolloServer, gql } from 'apollo-server-koa';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  },
};

const gqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

const app = new Koa();

// TODO Error handling middleware

app.use(jwt({
  secret: 'SecurityBy0bscurity',
  passthrough: true,
}));

gqlServer.applyMiddleware({ app });

app.listen(3000, 'localhost', () => console.log('Server up and running at port 3000.'))

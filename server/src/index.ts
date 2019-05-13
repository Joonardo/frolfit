import 'reflect-metadata';

import * as Koa from 'koa';
import * as jwt from 'koa-jwt';
import { ApolloServer, gql } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';

import { JWT_SECRET, JWT_COOKIE } from './config';
import { ITask } from 'pg-promise';
import transactionMiddleware from './middlewares/transactionMiddleware';
import Container from 'typedi';

declare module 'koa' {
  interface Context {
    state: {
      getTx: () => ITask<{}>;
      user: {
        id: string;
        exp: number;
      };
    };
  }
}

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/*.ts'],
    container: Container,
    // emitSchemaFile: true,
  });

  const gqlServer = new ApolloServer({
    schema,
    context: ({ ctx }: { ctx: Koa.Context }) => ctx,
    subscriptions: {
      path: '/subscriptions',
    },
    formatError: (error: any) => {
      console.error(error.extensions.exception.stacktrace.join('\n'));
      return error;
    },
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  });

  const app = new Koa();

  // TODO Error handling middleware

  app.use(
    jwt({
      secret: JWT_SECRET,
      cookie: JWT_COOKIE,
      key: 'user',
      passthrough: true,
    })
  );
  app.use((ctx: Koa.Context, next: () => Promise<any>) => {
    if (ctx.state.user && ctx.state.user.exp * 1000 < Date.now()) {
      ctx.body = {
        errors: ['Session expired. Please login again.'],
      };
      return;
    }
    return next();
  });
  app.use(transactionMiddleware);

  gqlServer.applyMiddleware({ app });

  const server = app.listen(3000, '0.0.0.0', () => {
    console.log(`Server up and running at http://localhost:3000/`);
  });
  gqlServer.installSubscriptionHandlers(server);
}

bootstrap();

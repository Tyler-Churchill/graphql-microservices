import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema, Query, Resolver } from 'type-graphql';

@Resolver()
export class MainResolver {
  @Query(returns => Boolean)
  isReadyChat() {
    console.log('I am a remotely executed resolver!');
    return true;
  }
}

(async () => {
  try {
    const schema = await buildSchema({
      resolvers: [MainResolver]
    });
    const server = new ApolloServer({
      schema,
      tracing: true
    });
    const { url } = await server.listen({ port: process.env.PORT || 8001 });
    console.log(`🚀 Server ready at ${url}`);
  } catch (e) {
    console.error(e);
  }
})();

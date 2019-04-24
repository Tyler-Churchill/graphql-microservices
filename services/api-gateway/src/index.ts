import * as fetch from 'isomorphic-fetch';
import { HttpLink } from 'apollo-link-http';
import {
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas
} from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { ApolloServer } from 'apollo-server';

/**
 * Loads and returns a remote schema given the services URI
 * https://dev.to/alex_barashkov/using-docker-for-nodejs-in-development-and-production-3cgp
 * https://www.apollographql.com/docs/graphql-tools/remote-schemas
 * https://medium.com/@brammus/how-to-setup-simple-typescript-graphql-microservices-using-an-api-gateway-5587f3de0232
 */
const loadSchema = async (serviceUri: string): Promise<GraphQLSchema> => {
  console.log(`Attempting to load schema from ${serviceUri}`);
  const schemaLink = new HttpLink({ uri: serviceUri, fetch });
  const schema = await introspectSchema(schemaLink);
  const remoteSchema = makeRemoteExecutableSchema({
    schema,
    link: schemaLink
  });
  console.log(`Retrieved schema from ${serviceUri}`);
  return remoteSchema;
};

const sleep = require('util').promisify(setTimeout);
const fetchSchema = async ({
  attempts = 25
}: {
  attempts?: number;
}): Promise<Array<GraphQLSchema>> => {
  try {
    const serviceUris = ['http://localhost:8001/graphql'];
    return await Promise.all(serviceUris.map(uri => loadSchema(uri)));
  } catch (err) {
    if (attempts === 1) throw new Error('Max retires exceeded');
    await sleep(2500);
    return await fetchSchema({ attempts: attempts - 1 });
  }
};

// init/startup
(async () => {
  try {
    // grab schemas from all microservices
    const schema = await fetchSchema({ attempts: 50 });
    // have now loaded all microservice schema, merge them
    const mergedSchema = mergeSchemas({
      schemas: schema
    });
    // schema has been merged, start server
    const server = new ApolloServer({ schema: mergedSchema });
    const { url } = await server.listen({
      port: process.env.PORT || 8080
    });
    console.log(`API-Gateway is running on ${url}`);
  } catch (e) {
    console.error(e);
  }
})();

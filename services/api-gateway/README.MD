One graph gateway to rule them all.....

## Building the gateway schema

1. Fetch schemas from all microservices by introspecting schemas
2. Make a remote schema, signaling to graphql that a schema can be resolved on a remote server
3. Combine all schemas and resolvers and serve it on the gateway server

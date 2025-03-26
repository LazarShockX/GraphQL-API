import { ApolloServer } from 'apollo-server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './typeDefs';

const server = new ApolloServer({
    typeDefs
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});

console.log(`Server ready at port`, 4000);
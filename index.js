import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import db from './_db.js';

const resolvers = {
    Query: {
        games: () => db.games,
        game: (_, args) => db.games.find(game => game.id === args.id),
        reviews: () => db.reviews,
        review: (_, args) => db.reviews.find(review => review.id === args.id),
        authors: () => db.authors,
        author: (_, args) => db.authors.find(author => author.id === args.id)
    },
    Game: {
        reviews: (game) => db.reviews.filter(review => review.game_id === game.id)
    },
    Author: {
        reviews: (author) => db.reviews.filter(review => review.author_id === author.id)
    },
    Review: {
        author: (review) => db.authors.find(author => author.id === review.author_id),
        game: (review) => db.games.find(game => game.id === review.game_id)
    },
    Mutation: {
        addGame(_, args) {
            let game = {
                ...args.game,
                id: String(db.games.length + 1)
            }
            db.games.push(game)

            return game
        },
        updateGame(_, args) {
            db.games = db.games.map(game => {
                if (game.id === args.id) {
                    return {
                        ...game,
                        ...args.edits
                    }
                }

                return game
            })

            return db.games.find(game => game.id === args.id)
        },
        deleteGame: (_, args) => db.games.filter(game => game.id !== args.id)
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});

console.log(`Server ready at port`, 4000);
import env from 'dotenv'
env.config()
import 'reflect-metadata'
import express from 'express'
import { buildSchema } from 'type-graphql'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { resolvers } from './resolvers';
import { connectToMongo } from './utils/mongo'
import { verifyJwt } from './utils/jwt';
import { User } from './schema/user.schema'
import Context from './types/context'
import authChecker from './utils/authChecker';


async function bootstrap() {

    //Build the schema

    const schema = await buildSchema({
        resolvers,
        authChecker
    })

    //Init Express
    const app = express()

    app.use(cookieParser())

    //Create the aplollo server
    const server = new ApolloServer({
        schema,
        context: (ctx: Context) => {
            const context = ctx;
            if (ctx.req.cookies.accessToken) {
                const user = verifyJwt<User>(ctx.req.cookies.accessToken)
                context.user = user
            }
            return context
        },
        plugins: [
            process.env.NODE_ENV === 'production' ?
                ApolloServerPluginLandingPageProductionDefault() :
                ApolloServerPluginLandingPageGraphQLPlayground()
        ]
    })

    await server.start()
    //apply middleware to server

    server.applyMiddleware({ app })


    //app.listen on express server
    app.listen({ port: 4002 }, () => {
        console.log("App is listening on  http://localhost:4000")
    })
    //Connect to db
    connectToMongo()

}


bootstrap();
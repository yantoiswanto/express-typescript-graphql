import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput, LoginInput, User } from "../schema/user.schema";
import UserService from '../service/user.service';
import Context from "../types/context";
import { Request, Response } from 'express'


@Resolver()
export default class UserResolver {

    constructor(private userService: UserService) {
        this.userService = new UserService()
    }

    @Mutation(() => User)
    createUser(@Arg('input') input: CreateUserInput) {
        return this.userService.createUser(input)
    }

    @Mutation(() => String)// Return the JWT
    login(@Arg('input') input: LoginInput, @Ctx() context: Context) {
        return this.userService.login(input, context)
    }


    @Query(() => User, { nullable: true })
    me(@Ctx() context: Context) {
        return context.user
    }
}
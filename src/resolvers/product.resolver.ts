import { Arg, Mutation, Resolver, Ctx, Authorized, Query } from 'type-graphql';
import { CreateProductInput, GetProductInput, Product } from '../schema/product.shema';
import ProductService from "../service/product.service";
import Context from '../types/context';

@Resolver()
export default class ProductResolver {
    constructor(private productService: ProductService) {
        this.productService = new ProductService()
    }

    @Authorized()
    @Mutation(() => Product)
    async createProduct(@Arg('input') input: CreateProductInput, @Ctx() context: Context) {
        const user = context.user!;
        return await this.productService.createProduct({
            ...input,
            user: user?._id
        })
    }

    @Query(() => [Product])
    async products() {
        return await this.productService.findProducts()
    }

    @Query(() => Product)
    async product(@Arg('input') input: GetProductInput) {
        return await this.productService.findSingleProduct(input)
    }
}
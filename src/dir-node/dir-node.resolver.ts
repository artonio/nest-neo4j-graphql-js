import {Mutation, Query, Resolver, ResolveReference} from "@nestjs/graphql"
import {DirNode} from "./dir-node.directive"
import {Neo4jDirNodeService} from "../neo4j/neo4j-dir-node.service"
import {Logger} from "@nestjs/common"
import {DeleteResponse } from './delete-response'
import {GraphQLJSONObject} from "graphql-type-json"



const models: DirNode[] = [
    {
        id: 1,
        dirName: 'root'
    },
    {
        id: 2,
        dirName: 'pictures'
    }
];


@Resolver(returns => DirNode)
export class DirNodeResolver {

    constructor(private readonly neo4jDirNodeService: Neo4jDirNodeService) {
    }

    @ResolveReference()
    resolveReference(dir_node: { __typename: string; id: number }) {

        return models.find(({ id }) => id === dir_node.id)
    }

    @Query(() => DirNode)
    dir() {
        return models[0]
    }

    @Mutation(() => GraphQLJSONObject)
    async clearGraph() {
        Logger.log('clearing graph', 'dir-node.resolver.ts')

        return await this.neo4jDirNodeService.run(`MATCH (n) DETACH DELETE n`);

    }
}

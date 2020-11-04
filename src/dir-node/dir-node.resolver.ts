import {Args, Context, Directive, Info, Mutation, Query, Resolver, ResolveReference} from "@nestjs/graphql"
import {DirNode} from "./dir-node"
import {Neo4jDirNodeService} from "../neo4j/neo4j-dir-node.service"
import {Logger} from "@nestjs/common"
import {GraphQLJSONObject} from "graphql-type-json"
import {neo4jgraphql} from 'neo4j-graphql-js';
import {DirNodeInput} from "./DirNodeInput"


const models: DirNode[] = [
    {
        id: '1',
        dirName: 'root'
    },
    {
        id: '2',
        dirName: 'pictures'
    }
];


@Resolver(returns => DirNode)
export class DirNodeResolver {

    logger: Logger = new Logger('DirNodeResolver');

    constructor(private readonly neo4jDirNodeService: Neo4jDirNodeService) {
    }

    @ResolveReference()
    resolveReference(dir_node: { __typename: string; id: string }) {

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

    @Mutation(() => DirNode, {name: 'CreateSeedData'})
    // @Directive(`@cypher(statement:"CREATE (n:DirNode {id: 1, dirName: 'Root123'}) RETURN n")`)
    @Directive(`@cypher(statement:"UNWIND $data as dirNode CREATE (n:DirNode {id: dirNode.id, dirName: dirNode.dirName}) RETURN n")`)
    async seedData(@Args('data') data: DirNodeInput, @Context() context, @Info() resolveInfo) {
        const object = null
        this.logger.log(JSON.stringify(data));
        return await neo4jgraphql(object, {data}, context, resolveInfo);
    }
}

import {Module} from "@nestjs/common"
import {GraphQLModule} from "@nestjs/graphql"
import {Neo4jConnectorModule} from "../neo4j/neo4j-connector.module"
import {DirNodeModule} from "../dir-node/dir-node.module"
import {NEO4J_DRIVERS_PROVIDER} from "../neo4j/neo4j.provider"
import {Neo4jSchemaService} from "../neo4j/neo4j-schema.service"
import {Driver} from 'neo4j-driver'


@Module({
    imports: [
        GraphQLModule.forRootAsync({
            imports: [Neo4jConnectorModule, DirNodeModule],
            inject: [NEO4J_DRIVERS_PROVIDER, Neo4jSchemaService],
            // useClass: Neo4jGraphqlService
            useFactory: (driver: Driver, schemaService: Neo4jSchemaService) => {
                return {
                    include: [DirNodeModule],
                    autoSchemaFile: true,
                    playground: true,
                    transformSchema: schemaService.transformSchema,
                    transformAutoSchemaFile: true,
                    context: (ctx) => ({
                        ...ctx,
                        driver
                    })
                }
            }
        })
    ],
    providers: [],
    exports: []
})
export class Neo4jGraphqlModule {
    
}

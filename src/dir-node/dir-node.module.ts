import {Module} from "@nestjs/common"
import {DirNodeResolver} from "./dir-node.resolver"
import {Neo4jConnectorModule} from "../neo4j/neo4j-connector.module"

@Module({
    imports: [Neo4jConnectorModule],
    providers: [DirNodeResolver]
})
export class DirNodeModule {
    
}

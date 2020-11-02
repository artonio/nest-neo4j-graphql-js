import { Module } from '@nestjs/common'
import { Neo4jSchemaService } from './neo4j-schema.service'
import { NEO4J_DRIVERS_PROVIDER, neo4DriversProvider } from './neo4j.provider'
import {Neo4jDirNodeService} from "./neo4j-dir-node.service"

@Module({
  providers: [neo4DriversProvider, Neo4jSchemaService, Neo4jDirNodeService],
  exports: [NEO4J_DRIVERS_PROVIDER, Neo4jSchemaService, Neo4jDirNodeService],
})
export class Neo4jConnectorModule {}

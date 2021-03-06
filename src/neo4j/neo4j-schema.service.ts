import {buildFederatedSchema} from '@apollo/federation'
import {Injectable, Logger} from '@nestjs/common'
import {GraphQLSchemaModule} from 'apollo-graphql'
import {GraphQLSchema, printSchema} from 'graphql'
import {makeAugmentedSchema} from 'neo4j-graphql-js'
import {extractResolversFromSchema} from 'neo4j-graphql-js/dist/augment/resolvers'
import {SchemaPrinter} from './schema-printer'

@Injectable()
export class Neo4jSchemaService {
  /**
   * Augment schema with Neo4j + Federation
   *
   * @param schema Nest.js code first schema
   */
  transformSchema(schema: GraphQLSchema) {
    const schemaPrinter = new SchemaPrinter({
      excludeScalar: false,
      includeSpecificScalarTypes: ['JSONObject'],
      excludeDirectives: true,
    })

    const resolvers = extractResolversFromSchema(schema)
    Logger.log(resolvers, 'Neo4jSchemaService');

    // Our user defined schema
    // printSchema(schema) from 'graphql' removes our NestJs Custom Directives
    // const typeDefs0: string = printSchema(schema)
    const typeDefs: string = schemaPrinter.printSchemaWithDirectives(schema)

    Logger.log(typeDefs, 'Neo4jSchemaService');
    const neo4jExtendedSchema: GraphQLSchemaModule = makeAugmentedSchema({
      resolvers,
      typeDefs,
      config: {
        isFederated: true,
      },
    })

    return buildFederatedSchema([neo4jExtendedSchema])
  }
}

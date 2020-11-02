import { FactoryProvider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import neo4j, { Driver } from 'neo4j-driver'

export const NEO4J_DRIVERS_PROVIDER = 'NEO4J_DRIVERS_PROVIDER'

export const neo4DriversProvider: FactoryProvider<Driver> = {
  provide: NEO4J_DRIVERS_PROVIDER,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    neo4j.driver(
      config.get('NEO4J_URL', ''),
      neo4j.auth.basic(
        config.get('NEO4J_USERNAME', ''),
        config.get('NEO4J_PASSWORD', ''),
      ),
    ),
}

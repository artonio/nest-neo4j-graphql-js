import {INestApplication} from "@nestjs/common"
import {Test} from "@nestjs/testing"
import {ConfigModule} from "@nestjs/config"
import * as request from 'supertest';
import {Neo4jGraphqlModule} from "./graphql/neo4j-graphql.module"


class RequestBuilder {
    static async executeQuery(
        query: string,
        app: INestApplication,
        queryName = '',
        expected?: any,
    ) {
        return expected
            ? request(app.getHttpServer())
                .post('/graphql')
                .send({ query })
                .expect(200)
                .then((response: any) => {
                    expect(response.body.data[queryName]).toStrictEqual(expected)
                })
            : request(app.getHttpServer())
                .post('/graphql')
                .send({ query })
                .expect(200)
    }
}

describe('E2e against test db', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.test.env',
                    isGlobal: true
                }),
                Neo4jGraphqlModule
            ],
        }).compile();

        app = moduleRef.createNestApplication()
        // Logger.log(httpServer, 'app.e2e.spec.ts')

        await app.init()
    });

    it('test', async () => {
        const queryName = 'CreateDirNode';
        const mutation = `
            mutation {
                ${queryName}(id: 2, dirName: "Pictures") {
                    id,
                    dirName
                }
            }
        `

        await RequestBuilder.executeQuery(mutation, app, queryName, {id: '2', dirName: 'Pictures'});
    });

    afterAll(async () => {
        await app.close();
    });
})

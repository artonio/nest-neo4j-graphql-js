import {Field, ObjectType} from "@nestjs/graphql"
import {GraphQLJSONObject} from "graphql-type-json"

@ObjectType()
export class DeleteResponse {
    constructor(response: any) {
        this.result = response
    }

    @Field((returns) => GraphQLJSONObject!)
    declare result: any
}

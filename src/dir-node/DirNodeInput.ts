import {Field, ID, InputType} from "@nestjs/graphql"

@InputType()
export class DirNodeInput {
    @Field(returns => ID, {nullable: false})
    id: number;

    @Field(returns => String)
    dirName: string;
}

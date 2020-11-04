import {Directive, Field, ID, ObjectType} from "@nestjs/graphql"

@ObjectType()
@Directive('@key(fields: "id")')
export class DirNode {

    @Field((type) => ID)
    declare id: string

    @Field()
    declare dirName: string;

    @Directive('@relation(name: "child", direction: "OUT")')
    @Field(() => [DirNode], { nullable: true })
    declare children?: Array<DirNode>;

    @Directive('@relation(name: "parent", direction: "IN")')
    @Directive('@cypher(statement:"MATCH (this)-->(parent) RETURN parent")')
    @Field(() => DirNode, { nullable: true })
    declare parent?: DirNode;
}

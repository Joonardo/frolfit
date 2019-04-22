import { ObjectType, Field, ID, Resolver, ResolverInterface } from "type-graphql";
import { Service } from "typedi";

@ObjectType()
export class Course {
  @Field(type => ID)
  id: string;

  @Field(type => String)
  name: string;

  @Field(type => String)
  description: string;
}

import { ObjectType, Field, Int } from "type-graphql";
import { Course } from "./course";

@ObjectType()
export class Hole {
  courseId: string;

  @Field(type => Course)
  course: Course;

  @Field(type => Int)
  par: number;

  @Field(type => Int)
  seq: number;

  @Field(type => String, { nullable: true })
  description: string;
}

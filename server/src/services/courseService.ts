import { ITask } from "pg-promise";
import { Course } from "../resolvers/course";

export default class CourseService {
  getById(id: string, tx: ITask<{}>): Promise<Course> {
    return tx.oneOrNone('select * from course where id = $(id)', { id });
  }
}

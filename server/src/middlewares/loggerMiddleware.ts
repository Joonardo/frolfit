import { Context } from "koa";

export default (ctx: Context, next: () => Promise<any>) => {
  //console.log(ctx.request.body);
  return next();
};

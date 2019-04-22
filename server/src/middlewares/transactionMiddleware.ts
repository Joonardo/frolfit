import { Context } from 'koa';

import db from '../common/db.util';

export default (ctx: Context, next: () => Promise<any>) => {
  return db.tx(tx => {
    ctx.state.getTx = () => tx;
    return next();
  });
};

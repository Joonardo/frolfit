import { ITask } from 'pg-promise';
import { Result } from '../resolvers/result';

export default class ResultService {
  getByGame(id: string, tx: ITask<{}>): Promise<Result[]> {
    return tx.any('select * from result where game = $(id)', { id });
  }

  create(
    game: string,
    player: string,
    hole: string,
    score: number,
    tx: ITask<{}>
  ): Promise<Result> {
    return tx.one(
      `
        insert into result(game, player, hole, score)
        values (
          $(game),
          $(player),
          $(hole),
          $(score)
        )
      `,
      { game, player, hole, score }
    );
  }
}

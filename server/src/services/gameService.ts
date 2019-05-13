import { ITask } from 'pg-promise';
import { Game, GameState, UpdateGameArgs } from '../resolvers/game';
import { Player } from '../resolvers/player';
import { pgp, NULL } from '../common/db.util';

export default class GameService {
  getById(id: string, tx: ITask<{}>): Promise<Game> {
    return tx.one('select * from game where id = $(id)', { id });
  }

  getByJoinCode(joinCode: string, tx: ITask<{}>): Promise<Game> {
    return tx.one(
      `
        select * from game
        where
          "joinCode" = $(joinCode)
        and
          state = 'pending'
      `,
      {
        joinCode,
      }
    );
  }

  getByPlayerId(pid: string, tx: ITask<{}>): Promise<Game[]> {
    return tx.any(
      `
        select g.*
        from participates p, game g
        where
          g.id = p.game and p.player = $(pid)
      `,
      { pid }
    );
  }

  getPending(pid: string, tx: ITask<{}>): Promise<Game | null> {
    return tx.oneOrNone(
      `
        select * from game where "creatorId" = $(pid) and state = 'pending'
      `,
      { pid }
    );
  }

  getPlayers(id: string, tx: ITask<{}>): Promise<Player[]> {
    return tx.any(
      `
        select pl.*
        from player pl, participates pa
        where
          pl.id = pa.player
        and
          pa.game = $(id)
      `,
      { id }
    );
  }

  async create(playerId: string, tx: ITask<{}>): Promise<Game> {
    const game = await tx.one(
      `
        insert into game("creatorId")
        values (
          $(playerId)
        )
        returning *
      `,
      { playerId }
    );
    const ok = await this.participate(game.id, playerId, tx);

    return ok ? game : null;
  }

  async update(
    update: UpdateGameArgs,
    tx: ITask<{}>
  ): Promise<Game> {
    return tx.oneOrNone(
      pgp.as.format(
        `
          update game
          set
            "courseId" = $(course),
            state = $(state)
          where
            id = $(id)
          returning *
        `,
        update,
        { def: NULL }
      )
    );
  }

  async participate(
    gameId: string,
    playerId: string,
    tx: ITask<{}>
  ): Promise<boolean> {
    const game = await this.getById(gameId, tx);

    if (!game || game.state !== GameState.PENDING) {
      return false;
    }
    try {
      await tx.none(
        `
          insert into participates
          values (
            $(playerId),
            $(gameId)
          )
        `,
        { playerId, gameId }
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}

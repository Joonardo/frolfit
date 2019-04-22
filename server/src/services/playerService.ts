import { ITask } from 'pg-promise';
import * as crypto from 'crypto';
import * as mailer from '../common/mailer.util';
import { Player } from '../resolvers/player';
import { pgp, NULL } from '../common/db.util';

export default class PlayerService {
  getById(id: string, tx: ITask<{}>): Promise<Player | null> {
    return tx.oneOrNone('select * from player where id = $(id)', { id });
  }

  getByEmail(email: string, tx: ITask<{}>): Promise<Player | null> {
    return tx.oneOrNone('select * from player where email = $(email)', {
      email,
    });
  }

  async getByToken(token: string, tx: ITask<{}>): Promise<Player | null> {
    const player = await tx.oneOrNone(
      'select * from player where token = $(token)',
      {
        token,
      }
    );

    if (!player) return null;
    return player;
  }

  create(username: string, email: string, tx: ITask<{}>): Promise<Player> {
    return tx.one(
      `
        insert into player(username, email)
        values (
          $(username),
          $(email)
        )
        returning *
      `,
      { username, email }
    );
  }

  update(player: Partial<Player>, tx: ITask<{}>): Promise<Player | null> {
    const data = {
      ...player,
      tokenGenerated: player.token ? new Date() : null,
    };
    return tx.oneOrNone(
      pgp.as.format(
        `
        update player
        set
          username = coalesce($(username), username),
          email = coalesce($(email), email),
          token = coalesce($(token), token),
          "tokenGenerated" = coalesce($(tokenGenerated), "tokenGenerated")
        where
          id = $(id)
        returning *
        `,
        data,
        { def: NULL }
      )
    );
  }

  async sendLoginToken(
    playerId: string,
    email: string,
    tx: ITask<{}>
  ): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    await this.update({ token, id: playerId }, tx);

    try {
      await mailer.sendLoginMail(email, token);
      return token;
    } catch (e) {
      console.error(e);
      return '';
    }
  }
}

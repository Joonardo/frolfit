import * as jwt from 'jsonwebtoken';
import {
  ObjectType,
  Field,
  Resolver,
  Query,
  Mutation,
  ID,
  FieldResolver,
  Root,
  Ctx,
  Args,
  ArgsType,
  ResolverInterface,
} from 'type-graphql';
import { Context } from 'koa';
import { JWT_SECRET, JWT_COOKIE } from '../config';
import { Service } from 'typedi';
import PlayerService from '../services/playerService';
import { Game } from './game';
import GameService from '../services/gameService';

@ArgsType()
class GenerateTokenArgs {
  @Field(type => String)
  email: string;
}

@ArgsType()
class ConsumeTokenArgs {
  @Field(type => String)
  token: string;
}

@ArgsType()
class PlayerQueryArgs {
  @Field(type => String)
  id: string;
}

@ArgsType()
class SignupArgs {
  @Field(type => String)
  username: string;

  @Field(type => String)
  email: string;
}

@ObjectType()
export class Player {
  token: string;
  tokenGenerated: Date; // unix timestamp

  @Field(type => ID)
  id: string;

  @Field(type => String)
  username: string;

  @Field(type => String)
  email: string;

  @Field(type => [Game])
  games: Game[];
}

@Service()
@Resolver(of => Player)
export class PlayerResolver implements ResolverInterface<Player> {
  constructor(
    private readonly playerService: PlayerService,
    private readonly gameSevice: GameService
  ) {}

  @Query(returns => Player, { nullable: true })
  me(@Ctx() { state }: Context): Promise<Player | null> {
    if (!state.user) {
      return null;
    }
    return this.playerService.getById(state.user.id, state.getTx());
  }

  @FieldResolver(returns => String)
  email(
    @Root() { id, email }: Player,
    @Ctx() { state }: Context
  ): string | null {
    if (!state.user || state.user.id !== id) {
      return null;
    }
    return email;
  }

  @FieldResolver(type => [ID])
  async games(
    @Root() player: Player,
    @Ctx() { state }: Context
  ): Promise<Game[]> {
    return this.gameSevice.getByPlayerId(player.id, state.getTx());
  }

  @FieldResolver(type => [ID])
  async scorecards(@Root() player: Player): Promise<string[]> {
    return await [];
  }

  @Query(returns => Player, { nullable: true })
  Player(
    @Args() { id }: PlayerQueryArgs,
    @Ctx() { state }: Context
  ): Promise<Player> {
    if (!state.user) {
      return null;
    }
    return this.playerService.getById(id, state.getTx());
  }

  @Mutation(returns => Boolean)
  async sendLoginMail(
    @Args() { email }: GenerateTokenArgs,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const tx = ctx.state.getTx();
    const player = await this.playerService.getByEmail(email, tx);

    if (!player) {
      return false;
    }

    const token = await this.playerService.sendLoginToken(player.id, email, tx);

    return true;
  }

  @Mutation(returns => Boolean)
  async consumeLoginToken(
    @Args() { token }: ConsumeTokenArgs,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const tx = ctx.state.getTx();
    const player = await this.playerService.getByToken(token, tx);

    if (!player) {
      return false;
    }

    await this.playerService.update({ token: '', id: player.id }, tx);

    if (player.tokenGenerated.getTime() < Date.now() - 3600 * 1000) {
      return false;
    }

    ctx.cookies.set(
      JWT_COOKIE,
      jwt.sign({ id: player.id }, JWT_SECRET, { expiresIn: '1y' })
    );

    return true;
  }

  @Mutation(returns => Boolean)
  logout(@Ctx() ctx: Context): boolean {
    ctx.cookies.set(JWT_COOKIE, '');
    return true;
  }

  @Mutation(returns => Player)
  async signup(
    @Args() { username, email }: SignupArgs,
    @Ctx() { state }: Context
  ): Promise<Player> {
    const player = await this.playerService.create(
      username,
      email,
      state.getTx()
    );
    const token = await this.playerService.sendLoginToken(
      player.id,
      email,
      state.getTx()
    );
    return !!token ? player : null;
  }
}

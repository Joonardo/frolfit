import {
  ObjectType,
  Field,
  ID,
  Resolver,
  Query,
  Ctx,
  ResolverInterface,
  FieldResolver,
  Root,
  Args,
  ArgsType,
  Mutation,
  Subscription,
  Arg,
  PubSub,
  Publisher,
  registerEnumType,
} from 'type-graphql';
import { Service } from 'typedi';
import { Course } from './course';
import GameService from '../services/gameService';
import { Context } from 'koa';
import CourseService from '../services/courseService';
import { Player } from './player';
import { Result } from './result';
import ResultService from '../services/resultService';
import PlayerService from '../services/playerService';

export enum GameState {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  ENDED = 'ended',
}
registerEnumType(GameState, {
  name: 'GameState',
  description: 'Describes the current state of specific game.',
});

@ObjectType()
class JoinNotification {
  @Field(type => String)
  gameId: string;

  @Field(type => Player)
  player: Player;
}

class PlayerJoinPayload {
  @Field(type => String)
  gameId: string;

  @Field(type => Player)
  player: Player;
}

@ArgsType()
class GameArgs {
  @Field(type => String)
  id: string;
}

@ArgsType()
export class UpdateGameArgs {
  @Field(type => String)
  id: string;

  @Field(type => String, { nullable: true })
  course: string;

  @Field(type => GameState, { nullable: true })
  state: GameState;
}

@ObjectType()
export class Game {
  courseId: string;
  creatorId: string;

  @Field(type => ID)
  id: string;

  @Field(type => GameState)
  state: GameState;

  @Field(type => Player)
  creator: Player;

  @Field(type => Course, { nullable: true })
  course: Course;

  @Field(type => [Player])
  players: Player[];

  @Field(type => [Result])
  results: Result[];
}

@Service()
@Resolver(of => Game)
export class GameResolver implements ResolverInterface<Game> {
  constructor(
    private readonly playerService: PlayerService,
    private readonly gameService: GameService,
    private readonly courseService: CourseService,
    private readonly resultService: ResultService
  ) {}

  @FieldResolver(returns => Player)
  creator(
    @Root() { creatorId }: Game,
    @Ctx() { state }: Context
  ): Promise<Player> {
    return this.playerService.getById(creatorId, state.getTx());
  }

  @FieldResolver(returns => [Player])
  players(@Root() { id }: Game, @Ctx() { state }: Context): Promise<Player[]> {
    return this.gameService.getPlayers(id, state.getTx());
  }

  @FieldResolver(returns => Course)
  course(
    @Root() { courseId }: Game,
    @Ctx() { state }: Context
  ): Promise<Course> {
    return this.courseService.getById(courseId, state.getTx());
  }

  @FieldResolver(returns => [Result])
  results(@Root() { id }: Game, @Ctx() { state }: Context): Promise<Result[]> {
    return this.resultService.getByGame(id, state.getTx());
  }

  @Query(returns => Game, { nullable: true })
  async Game(
    @Ctx() { state }: Context,
    @Args() { id }: GameArgs
  ): Promise<Game> {
    const tx = state.getTx();
    if (!state.user) {
      return null;
    }
    const myGameIds = (await this.gameService.getByPlayerId(
      state.user.id,
      tx
    )).map(g => g.id);
    if (!myGameIds.includes(id)) {
      return null;
    }
    return this.gameService.getById(id, tx);
  }

  @Mutation(returns => Game, { nullable: true })
  async createGame(@Ctx() { state }: Context): Promise<Game> {
    if (!state.user) {
      return null;
    }
    try {
      const game = await this.gameService.getPending(
        state.user.id,
        state.getTx()
      );
      if (game) {
        return game;
      }
      return this.gameService.create(state.user.id, state.getTx());
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  @Mutation(returns => Game, { nullable: true })
  async updateGame(
    @Ctx() { state }: Context,
    @Args() update: UpdateGameArgs
  ): Promise<Game> {
    if (!state.user) {
      return null;
    }

    const game = await this.gameService.getById(update.id, state.getTx());
    if (!game || game.state === GameState.ENDED) {
      return null;
    }
    if (game.creatorId !== state.user.id) {
      console.error(
        `Authorization failed: Player ${state.user.id} is not creator of game ${
          update.id
        }`
      );
      return null;
    }
    return this.gameService.update(update, state.getTx());
  }

  @Mutation(returns => Boolean)
  async joinGame(
    @Ctx() { state }: Context,
    @Arg('game') gameId: string,
    @PubSub('PLAYER_JOINED') publish: Publisher<PlayerJoinPayload>
  ): Promise<boolean> {
    if (!state.user) {
      return false;
    }
    const tx = state.getTx();
    const joined = await this.gameService.participate(
      gameId,
      state.user.id,
      tx
    );
    if (joined) {
      const player = await this.playerService.getById(state.user.id, tx);
      await publish({ player, gameId });
    }
    return joined;
  }

  @Subscription({
    topics: 'PLAYER_JOINED',
    filter: ({ args, payload }) => args.game === payload.gameId,
  })
  playerJoined(
    @Root() { player }: PlayerJoinPayload,
    @Arg('game') gameId: string
  ): Player {
    return player;
  }
}

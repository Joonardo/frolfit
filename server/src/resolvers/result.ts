import {
  ObjectType,
  Field,
  Int,
  ResolverInterface,
  FieldResolver,
  Root,
  Ctx,
  Resolver,
  ArgsType,
  InputType,
  Mutation,
  Arg,
  Args,
} from 'type-graphql';
import { Player } from './player';
import { Game } from './game';
import { Hole } from './hole';
import PlayerService from '../services/playerService';
import GameService from '../services/gameService';
import { Context } from 'koa';
import { Service } from 'typedi';
import { IsInt, Min, Max } from 'class-validator';
import ResultService from '../services/resultService';

@InputType()
class ResultInput {
  @Field(type => String)
  player: string;

  @Field(type => String)
  game: string;

  @Field(type => String)
  hole: string;

  @IsInt()
  @Min(1)
  @Field(type => Int)
  score: number;
}

@ArgsType()
class AddResultsArgs {
  @Field(type => [ResultInput])
  results: ResultInput[];
}

@ObjectType()
export class Result {
  playerId: string;
  gameId: string;
  holeId: string;

  @Field(type => Player)
  player: Player;

  @Field(type => Game)
  game: Game;

  @Field(type => Hole)
  hole: Hole;

  @Field(type => Int)
  result: number;
}

@Service()
@Resolver(of => Result)
export class ResultResolver implements ResolverInterface<Result> {
  constructor(
    private readonly playerService: PlayerService,
    private readonly gameService: GameService,
    private readonly resultService: ResultService
  ) {}

  @FieldResolver(returns => Player)
  player(
    @Root() { playerId }: Result,
    @Ctx() { state }: Context
  ): Promise<Player> {
    return this.playerService.getById(playerId, state.getTx());
  }

  @FieldResolver(returns => Game)
  game(@Root() { gameId }: Result, @Ctx() { state }: Context): Promise<Game> {
    return this.gameService.getById(gameId, state.getTx());
  }

  @Mutation(returns => [Result])
  createResult(
    @Args() { results }: AddResultsArgs,
    @Ctx() { state }: Context
  ): Promise<Result[]> {
    return Promise.all(
      results.map(async res => {
        try {
          const result = this.resultService.create(
            res.game,
            res.player,
            res.hole,
            res.score,
            state.getTx()
          );
        } catch (e) {
          console.error(e);
          return null;
        }
      })
    );
  }
}

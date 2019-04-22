import 'reflect-metadata';

import * as faker from 'faker';
import * as pg from 'pg-promise';
import { Container } from 'typedi';
import { Player } from './src/resolvers/player';
import PlayerService from './src/services/playerService';
import CourseService from './src/services/courseService';
import GameService from './src/services/gameService';
import { Course } from './src/resolvers/course';
import { Game } from './src/resolvers/game';

const pgp = pg();
const db = pgp({
  host: 'localhost',
  user: 'postgres',
  database: 'frolfit',
});

function createPlayer(playerService: PlayerService, tx: pg.ITask<{}>): string {
  const player = new Player();
  player.id = faker.random.uuid();
  player.username = faker.hacker.noun();
  player.email = faker.internet.email();

  // TODO add to db

  return player.id;
}

function createCourse(courseService: CourseService, tx: pg.ITask<{}>): string {
  const course = new Course();
  course.id = faker.random.uuid();
  course.name = faker.address.county();
  course.description = faker.lorem.paragraph();

  // TODO add to db

  return course.id;
}

function createGame(
  gameservice: GameService,
  trackId: string,
  tx: pg.ITask<{}>
): string {
  const game = new Game();
  game.id = faker.random.uuid();
  game.courseId = trackId;

  // TODO add to db

  return game.id;
}

async function bootstrap(tx: pg.ITask<{}>) {
  const gameService = new GameService();
  const playerService = new PlayerService();
  const courseService = new CourseService();

  console.log(createPlayer(playerService, tx));
}

db.tx(async tx => {
  await bootstrap(tx);
});

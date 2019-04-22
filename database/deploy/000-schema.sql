BEGIN TRANSACTION;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE player (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  token TEXT,
  "tokenGenerated" TIMESTAMP
);

CREATE TABLE course (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT
);

CREATE TYPE GAMESTATE AS ENUM('pending', 'ongoing', 'ended');
CREATE TABLE game (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "courseId" UUID REFERENCES course(id),
  creator UUID REFERENCES player(id),
  state GAMESTATE DEFAULT 'pending'
);

CREATE TABLE participates (
  player UUID REFERENCES player(id),
  game UUID REFERENCES game(id),
  PRIMARY KEY (player, game)
);

CREATE TABLE hole (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "courseId" UUID REFERENCES course(id),
  seq INT NOT NULL UNIQUE CHECK (seq > 0),
  par INT NOT NULL CHECK (par > 0),
  description TEXT
);

CREATE TABLE result (
  player UUID REFERENCES player(id),
  game UUID REFERENCES game(id),
  hole UUID REFERENCES hole(id),
  score INT NOT NULL CHECK (score > 0),
  PRIMARY KEY (player, game, hole)
);

COMMIT;

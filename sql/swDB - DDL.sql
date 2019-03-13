CREATE TABLE FACTION(
  factionid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  numMembers BIGINT(50),
  leader INT
);

CREATE TABLE PLANET(
  planetid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(100),
  population BIGINT(50),
  owner INT,
  FOREIGN KEY(owner) REFERENCES FACTION(factionid) ON DELETE SET NULL
);

CREATE TABLE BEING(
  beingid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  fname VARCHAR(100) NOT NULL,
  lname VARCHAR(100),
  race VARCHAR(100) NOT NULL,
  homeworld INT,
  force_sensitive BOOLEAN NOT NULL DEFAULT False,
  FOREIGN KEY(homeworld) REFERENCES PLANET(planetid) ON DELETE SET NULL
);

ALTER TABLE FACTION
  ADD FOREIGN KEY(leader) REFERENCES BEING(beingid) ON DELETE SET NULL;

CREATE TABLE FORCE_POWER(
  forceid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  lethal BOOLEAN NOT NULL
);

CREATE TABLE FORCE_USER(
  forceid INT,
  beingid INT,
  PRIMARY KEY(forceid, beingid),
  FOREIGN KEY(forceid) REFERENCES FORCE_POWER(forceid) ON DELETE CASCADE,
  FOREIGN KEY(beingid) REFERENCES BEING(beingid) ON DELETE CASCADE
);

CREATE TABLE ALLEGIANCE(
  beingid INT,
  factionid INT,
  PRIMARY KEY(factionid, beingid),
  FOREIGN KEY(factionid) REFERENCES FACTION(factionid) ON DELETE CASCADE,
  FOREIGN KEY(beingid) REFERENCES BEING(beingid) ON DELETE CASCADE
);

CREATE TABLE SHIP(
  shipid INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(100) DEFAULT NULL,
  model VARCHAR(100) NOT NULL,
  make VARCHAR(100) NOT NULL,
  captain INT,
  capacity INT NOT NULL,
  FOREIGN KEY(captain) REFERENCES BEING(beingid) ON DELETE SET NULL
);

INSERT INTO FACTION (name, numMembers)
VALUES ('Sith', 700),
  ('Jedi', 500),
  ('Galactic Empire', 10000000),
  ('Rebel Alliance', 1700000),
  ('Local Governments', 15000000000000),
  ('Unaffiliated', 20000000000),
  ('Separatist Alliance', 0);

INSERT INTO PLANET(name, population, owner)
VALUES  ('Tatooine', 1000000000, 5),
  ('Coruscant', 1000000000000, 3),
  ('Hoth', 802212741, 4),
  ('Bespin', 6000000, 3),
  ('Kashyyyk', 56000000, 4),
  ('Tython', 5454433, 2),
  ('Korriban', 1353362, 1),
  ('Corellia', 5959774052, 3),
  ('Naboo', 200256132, 4),
  ('Serenno', 22454289,5),
  ('Kamino', 5980150, 5),
  ('Unknown', 'N/A', 6),
  ('Chandrila', 1200000000, 3);

INSERT INTO BEING(fname, lname, race, homeworld, force_sensitive)
VALUES  ('Han', 'Solo', 'Human', 8, False),
  ('Luke', 'Skywalker', 'Human', 1, True),
  ('Darth Sidious', '', 'Human', 9, True),
  ('Count Dooku', '', 'Human', 10, True),
  ('Boba', 'Fett', 'Human', 11, False),
  ('Yoda', '', 'Unknown', 12, True),
  ('Mon', 'Mothma', 'Human', 13, False);

UPDATE FACTION SET leader = 3
WHERE name = 'Sith' OR name = 'Galactic Empire';

UPDATE FACTION SET leader = 6
WHERE name = 'Jedi';

UPDATE FACTION SET leader = 4
WHERE name = 'Separatist Alliance';

UPDATE FACTION SET leader = 7
WHERE name = 'Rebel Alliance';

INSERT INTO FORCE_POWER(name, lethal)
VALUES  ('Lightning', True),
  ('Jump', False),
  ('Pull', False),
  ('Push', False),
  ('Materialize', False),
  ('Mind Trick', False),
  ('Speed', False),
  ('Heal', False),
  ('Choke', True),
  ('Gravity', True),
  ('Shape Shift', False),
  ('Grip', True);


INSERT INTO FORCE_USER(forceid, beingid)
VALUES  (2, 2),
  (3, 2),
  (4, 2),
  (6, 2),
  (12, 2),
  (1, 3),
  (2, 3),
  (3, 3),
  (4, 3),
  (6, 3),
  (7, 3),
  (9, 3),
  (12, 3),
  (1, 4),
  (2, 4),
  (3, 4),
  (4, 4),
  (6, 4),
  (12, 4),
  (2, 6),
  (3, 6),
  (4, 6),
  (6, 6),
  (7, 6),
  (8, 6),
  (12, 6);

INSERT INTO ALLEGIANCE(factionid, beingid)
VALUES (4, 1),
  (2, 2),
  (4, 2),
  (1, 3),
  (3, 3),
  (1, 4),
  (7, 4),
  (6, 5),
  (2, 6),
  (4, 7);

INSERT INTO SHIP(name, model, make, captain, capacity)
VALUES  ('Milennium Falcon', 'YT-1300F', 'Corellian Engineering Corporation', 1, 20),
  ('X-wing Starfighter', 'T-65B', 'Incom Corporation', 2, 1),
  ('Imperial Shuttle', 'Lambda-class T-4a shuttle', 'Cygnus Spaceworks', 3, 25),
  ('Punworcca', 'solar sailer', 'Huppla Pasa Tisc Shipwrights Collective', 4, 10),
  ('Slave One', 'Firespray-31', 'Kuat Drive Yards', 5, 2),
  ("Yoda's Cruiser", 'Consular-class space cruiser', 'Corellian Engineering Corporation', 6, 25),
  ('Home One', 'MC80A Star Cruiser', 'Mon Calamari Shipyards', 7, 5500);
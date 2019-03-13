/******************************
FACTION CRUD Statements
*******************************/

-- get all faction names, # of members, and leader names
SELECT factionid, name, numMembers, FORMAT(numMembers, 0) AS numMembers_view, leader, (CASE WHEN leader IS NULL THEN 'Unknown' ELSE CONCAT(fname, ' ', lname) END) AS leader_string FROM FACTION LEFT JOIN BEING ON FACTION.leader = BEING.beingid;

-- add a new faction, : denotes user defined variables
INSERT INTO FACTION(name, numMembers)
VALUES (:nameInput, :numMembersInput);

-- set a faction's leader
UPDATE FACTION SET leader = :leaderIdInput
WHERE name = :factionNameInput;

-- update faction entry - : denotes user defined variables
UPDATE FACTION
SET name = :nameInput,
    leader = :leaderIdInput,
    numMembers = :numMembersInput
WHERE factionid = :factionIdInput;

-- delete a faction entry - : denotes user defined entry
DELETE FROM FACTION WHERE factionid = :factionIdInput;

/***********************************
PLANET CRUD Statements
************************************/

-- list planet names, populations, and owning faction
SELECT planetid, P.name AS name, population, FORMAT(population, 0) AS population_view, owner, (CASE WHEN F.name IS NULL THEN 'Unknown' ELSE F.name END) AS ownername FROM PLANET P LEFT JOIN FACTION F ON F.factionid = P.owner ORDER BY planetid;

-- add a new planet - : denotes user defined entry
INSERT INTO PLANET(name, population, owner)
VALUES(:planetNameInput, :populationInput, :ownerInput);

-- update planet information - : denotes user defined entry
UPDATE PLANET
SET name = :nameInput,
    population = :populationInput,
    owner = :ownerInput
WHERE planetid = :planetIdInput;

-- delete planet entry - : denotes user defined entry
DELETE FROM PLANET WHERE planetid = :planetIdInput;

/**********************************
BEING CRUD Statements
**********************************/

-- list beings first and last name, race, homeworld, and force sensitivity
SELECT CONCAT(fname, ' ', lname) AS name, race, name AS homeworld, (CASE WHEN force_sensitive THEN 'Yes' ELSE 'No' END) AS force_sensitive FROM BEING B
INNER JOIN PLANET P
ON P.planetid = B.homeworld;

SELECT beingid, fname, lname, race, homeworld, (CASE WHEN homeworld IS NULL THEN 'Unknown' ELSE name END) AS homeworld_string, force_sensitive, (CASE WHEN force_sensitive THEN 'Yes' ELSE 'No' END) AS force_sensitive_string FROM BEING B LEFT JOIN PLANET P ON P.planetid = B.homeworld;

-- add a new being - : denotes user defined entry
INSERT INTO BEING(fname, lname, race, homeworld, force_sensitive)
VALUES(:fnameInput, :lnameInput, :raceInput, :homeworldInput, :force_sensitiveInput);

-- update a being's information - : denotes user defined entry
UPDATE BEING
SET fname = :fnameInput,
    lname = :lnameInput,
    race = :raceInput,
    homeworld = :homeworldInput,
    force_sensitive = :binary
WHERE beingid = :beingIdInput;

-- delete a being - : denotes user defined entry
DELETE FROM BEING WHERE beingid = :beingIdInput;

/********************************
ALLEGIANCE CRUD Statements
*********************************/

-- select and display all allegiance entries [(being, faction) pairings]
SELECT CONCAT(fname, ' ', lname) AS being, F.name AS faction FROM ALLEGIANCE A
  INNER JOIN BEING B
    ON B.beingid = A.beingid
  INNER JOIN FACTION F
    ON F.factionid = A.factionid;

SELECT A.beingid, CONCAT(fname, ' ', lname) AS beingname, A.factionid, F.name AS factionname FROM ALLEGIANCE A
  INNER JOIN BEING B
    ON B.beingid = A.beingid
  INNER JOIN FACTION F
    ON F.factionid = A.factionid;



-- add an allegiance between being and faction - : denotes user defined variables
INSERT INTO ALLEGIANCE (beingid, factionid)
VALUES (:beingIdInput, :factionIdInput);

-- update a being's allegiance - : denotes user entry
UPDATE ALLEGIANCE SET factionid = :factionIdInput, beingid = :beingIdInput
WHERE beingid = :beingIdInput;

-- delete specific entry pairing - : denotes user defined variables
DELETE FROM ALLEGIANCE WHERE (beingid, factionid) = (:beingIdInput, :factionIdInput);

-- delete all entries for a faction - : denotes user defined variables
DELETE FROM ALLEGIANCE WHERE factionid = :factionIdInput;

-- delete all entries for a being - : denotes user defined variables
DELETE FROM ALLEGIANCE WHERE beingid = :beingIdInput;


/********************************
FORCE USER CRUD Statements
********************************/

-- select all Force User entries - : denotes user defined variables
SELECT CONCAT(fname, ' ', lname) AS being, P.name AS power FROM FORCE_USER U
  INNER JOIN BEING B
    ON B.beingid = U.beingid
  INNER JOIN FORCE_POWER P
    ON P.forceid = U.forceid;

-- add a force user entry - : denotes user defined variables
INSERT INTO FORCE_USER (forceid, beingid)
VALUES (:forceIdInput, :beingIdInput)

-- update Force User Entries - : denotes user defined variables
UPDATE FORCE_USER SET forceid = :forceIdInput
WHERE beingid = :beingIdInput;

-- delete entry from force user table (only a single row will be deleted) - : denotes user defined variables
DELETE FROM FORCE_USER WHERE (forceid, beingid) = (:forceIdInput, :beingIdInput);

-- delete all entries containing specific force power - : denotes user defined variables
DELETE FROM FORCE_USER WHERE forceid = :forceIdInput;

-- delete all entries containing specific being - : denotes user defined variables
DELETE FROM FORCE_USER WHERE beingid = :beingIdInput;

/*******************************
SHIP CRUD Statements
********************************/

SELECT A.beingid, CONCAT(fname, ' ', lname) AS beingname, A.forceid, F.name AS forcename FROM FORCE_USER A INNER JOIN BEING B ON B.beingid = A.beingid INNER JOIN FORCE_POWER F ON F.forceid = A.forceid

-- list ships with names, models, makes, captain, capacity
SELECT shipid, name, model, make, B.beingid, (CASE WHEN captain IS NULL THEN 'Unassigned' ELSE CONCAT(fname, ' ', lname) END) as captain, capacity FROM SHIP S
LEFT JOIN BEING B
ON B.beingid = S.captain;

SELECT shipid, name, model, make, B.beingid AS captain, (CASE WHEN captain IS NULL THEN 'Unassigned' ELSE CONCAT(fname, ' ', lname) END) as captain_string, capacity FROM SHIP S LEFT JOIN BEING B ON B.beingid = S.captain;

-- list ships that don't have a captain assigned to them
SELECT name, model, make, capacity FROM SHIP
WHERE captain IS NULL;

-- update ship details - : denotes user defined variables
UPDATE SHIP
SET name = :nameInput,
    model = :modelInput,
    make = :makeInput,
    captain = :captainIdInput,
    capacity = :capacityInput
WHERE shipid = :shipIdInput;

-- delete specific ship - : denotes user defined variables
DELETE FROM SHIP WHERE shipid = :shipIdInput;

/*******************************
FORCE_POWER CRUD Statements
*******************************/

-- lists force powers and whether they are lethal or not
SELECT name, (CASE WHEN lethal THEN 'Lethal' ELSE 'Non-lethal' END) AS lethal FROM FORCE_POWER;

-- add a new power into force power table - : denotes user defined variables
INSERT INTO FORCE_POWER (name, lethal) VALUES (:nameInput, :binary);

-- update a force power name and/or lethality - : denotes user defined variables
UPDATE FORCE_POWER
SET name = :nameInput,
    lethal = :binary
WHERE forceid = :forceIdInput;

-- Delete a Force Power Entry - : denotes user defined variables
DELETE FROM FORCE_POWER WHERE forceid = :forceIdInput;

/*************************************************************
HELPER QUERIES FOR DROPDOWN MENUS - View Layer
**************************************************************/

-- list faction ids with corresponding names for dropdown menu
SELECT factionid, name FROM FACTION;

-- list force power ids with corresponding names for dropdown menu
SELECT forceid, name FROM FORCE_POWER;

-- list being ids with corresponding names for dropdown menu
SELECT beingid, CONCAT(fname, ' ', lname) AS name FROM BEING;

-- list planet ids with corresponding names for dropdown menu
SELECT planetid, name FROM PLANET;

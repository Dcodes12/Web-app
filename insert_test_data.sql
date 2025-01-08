# Insert data into the tables

USE TennisDB;

INSERT INTO TennisPlayers (FirstName, LastName, Age, Height, Weight, Country, Handedness)
VALUES
('Adam', 'Johnson', 22, 180, 80, 'UK', 'Right');

INSERT INTO PlayerStatistics (PlayerID, MatchesPlayed, MatchesWon, Aces, DoubleFaults, BreakPointsSaved)
VALUES
(1, 15, 10, 11, 30, 50);
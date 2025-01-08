CREATE DATABASE TennisDB;

USE TennisDB;

CREATE TABLE TennisPlayers (
    PlayerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Age INT CHECK (Age >= 0),
    Height DECIMAL(5,2) CHECK (Height > 0),
    Weight DECIMAL(5,2) CHECK (Weight > 0),
    Country VARCHAR(50) NOT NULL,
    Ranking INT CHECK (Ranking > 0),
    Handedness ENUM('Right', 'Left', 'Ambidextrous') DEFAULT 'Right'
);

-- Create the PlayerStatistics table
CREATE TABLE PlayerStatistics (
    StatID INT AUTO_INCREMENT PRIMARY KEY,      
    PlayerID INT NOT NULL,                      
    MatchesPlayed INT DEFAULT 0,               
    MatchesWon INT DEFAULT 0,                   
    Aces INT DEFAULT 0,                         
    DoubleFaults INT DEFAULT 0,                 
    BreakPointsSaved INT DEFAULT 0,             
    FOREIGN KEY (PlayerID) REFERENCES TennisPlayers(PlayerID)
);

CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT, first_name VARCHAR(50), last_name VARCHAR(50), username VARCHAR(20), 
password VARCHAR(20), email VARCHAR(50), hashedPassword VARCHAR(100), PRIMARY KEY(id));

# Create the app user
CREATE USER 'TennisDB_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON tennisdb.* TO 'TennisDB_app'@'localhost';
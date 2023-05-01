CREATE TABLE category (
    categoryid INTEGER PRIMARY KEY,
    name       TEXT NOT NULL
);

CREATE TABLE film (
    filmid   INTEGER PRIMARY KEY,
    name     TEXT NOT NULL,
    link     TEXT NOT NULL,
    category INTEGER NOT NULL,
    FOREIGN KEY(category) REFERENCES category(categoryid)
);

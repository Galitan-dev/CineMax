CREATE TABLE category (
    id INTEGER PRIMARY KEY,
    name       TEXT NOT NULL
);

CREATE TABLE film (
    id   INTEGER PRIMARY KEY,
    name     TEXT NOT NULL,
    link     TEXT NOT NULL,
    categoryid INTEGER NOT NULL,
    FOREIGN KEY(categoryid) REFERENCES category(id)
);

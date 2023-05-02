import { readFileSync } from 'fs';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const { Database } = sqlite3.verbose();
process.chdir(fileURLToPath(new URL("..", import.meta.url)));

const db = new Database("db/database.sqlite");
db.serialize(() => {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='film';", (err, row) => {
        if (row?.name != 'film') {
            const queries = readFileSync('db/schema.sql', 'utf8').split('\n\n');
            for (const query of queries) {
                if (query.length == 0) continue;
                db.run(query, (err) => {
                    if (err) throw err;
                    fixtures(db)
                });
            }
        } else {
            fixtures(db);
        }
    });
});

function fixtures(db) {
    const categories = ["Action", "Comédie", "Drame", "Fiction jeunesse",
        "Musical", "Policier", "Science Fiction", "Western", "Documentaire"];
    const stmt = db.prepare("INSERT INTO category (name) VALUES (?)");
    for (const category of categories) {
        stmt.run(category);
    }
    for (let i = 0; i < categories.length; i++) {
        const stmt = db.prepare("INSERT INTO film (name, link, categoryid) VALUES (?, ?, ?)");
        for (let j = 0; j < 10; j++) {
            stmt.run(`Film ${categories[i]} #${j + 1}`, "https://example.com", i + 1);
        }
    }
}

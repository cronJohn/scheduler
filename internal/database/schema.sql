CREATE TABLE users (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    role TEXT NOT NULL,
    day TEXT NOT NULL,
    clockIn TEXT NOT NULL,
    clockOut TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

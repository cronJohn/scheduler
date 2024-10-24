CREATE TABLE users (
    user_id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE schedules (
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    day TEXT NOT NULL,
    clock_in TEXT NOT NULL,
    clock_out TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

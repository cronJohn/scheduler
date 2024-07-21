CREATE TABLE users (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    week_start_date TEXT NOT NULL,
    day_of_week INTEGER CHECK(day_of_week BETWEEN 0 AND 6) NOT NULL,
    clock_in INTEGER CHECK(clock_in BETWEEN 0 AND 23) NOT NULL,
    clock_out INTEGER CHECK(clock_out BETWEEN 0 AND 23) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    day_of_week INTEGER CHECK(day_of_week BETWEEN 0 AND 6),
    clock_in TEXT,
    clock_out TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);


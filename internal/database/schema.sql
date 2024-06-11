CREATE TABLE employees (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    day_of_week INTEGER CHECK(day_of_week BETWEEN 0 AND 6) NOT NULL,
    clock_in TEXT NOT NULL,
    clock_out TEXT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

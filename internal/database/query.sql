-- name: SetRole :exec
INSERT INTO roles (name) VALUES (?);

-- name: SetEmployee :exec
INSERT INTO employees (id, name, role_id) VALUES (?, ?, ?);

-- name: ViewAll :many
SELECT * FROM employees;

-- name: SetSchedule :exec
INSERT INTO schedules (employee_id, day_of_week, clock_in, clock_out) VALUES (?, ?, ?, ?);

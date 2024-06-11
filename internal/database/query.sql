-- name: GetUserSchedules :many
SELECT * FROM schedules
WHERE employee_id = ?;

-- name: ViewAllEmployees :many
SELECT * FROM employees;

-- name: SetRole :exec
INSERT INTO roles (name) VALUES (?);

-- name: SetEmployee :exec
INSERT INTO employees (id, name, role_id) VALUES (?, ?, ?);

-- name: ClearSchedules :exec
DELETE FROM schedules;

-- name: SetSchedule :exec
INSERT INTO schedules (id, employee_id, day_of_week, clock_in, clock_out)
VALUES (?, ?, ?, ?, ?);

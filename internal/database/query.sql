-- name: GetUserSchedules :many
SELECT
    day_of_week,
    GROUP_CONCAT(clock_in || ' - ' || clock_out, ',') AS times
FROM
    schedules
WHERE
    employee_id = ?
GROUP BY
    day_of_week
ORDER BY
    day_of_week;

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

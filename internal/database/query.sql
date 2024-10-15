-- name: CreateUser :exec
INSERT INTO users (id, name)
VALUES (?, ?);

-- name: GetUsers :many
SELECT *
FROM users;

-- name: UpdateUserByID :exec
UPDATE users
SET name = ?
WHERE id = ?;

-- name: DeleteUserByID :exec
DELETE FROM users
WHERE id = ?;

-- name: GetSchedulesByUserID :many
SELECT id, role, day, clockIn, clockOut
FROM schedules
WHERE userId = ?;

-- name: GetAllSchedules :many
SELECT users.name, schedules.id, schedules.userId as "userId", schedules.role, schedules.day, schedules.clockIn as "clockIn", schedules.clockOut as "clockOut"
FROM schedules
JOIN users ON schedules.userId= users.id;

-- name: CreateSchedule :exec
INSERT INTO schedules (userId, role, day, clockIn, clockOut)
VALUES (?, ?, ?, ?, ?);

-- name: UpdateScheduleTimes :exec
UPDATE schedules
SET day = ?, role = ?, clockIn = ?, clockOut = ?
WHERE id = ?;

-- name: DeleteSchedule :exec
DELETE FROM schedules
WHERE id = ?;

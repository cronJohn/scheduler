-- name: CreateUser :exec
INSERT INTO users (id, name, role)
VALUES (?, ?, ?);

-- name: GetUsers :many
SELECT *
FROM users;

-- name: UpdateUserByID :exec
UPDATE users
SET name = ?, role = ?
WHERE id = ?;

-- name: DeleteUserByID :exec
DELETE FROM users
WHERE id = ?;

-- name: GetSchedulesByUserID :many
SELECT id, day, clockIn, clockOut
FROM schedules
WHERE userId = ?;

-- name: GetAllSchedules :many
SELECT users.name, users.role, schedules.id, schedules.userId as "userId", schedules.day, schedules.clockIn as "clockIn", schedules.clockOut as "clockOut"
FROM schedules
JOIN users ON schedules.userId= users.id;

-- name: CreateSchedule :exec
INSERT INTO schedules (userId, day, clockIn, clockOut)
VALUES (?, ?, ?, ?);

-- name: UpdateScheduleTimes :exec
UPDATE schedules
SET clockIn = ?, clockOut = ?, day = ?
WHERE id = ?;

-- name: DeleteSchedule :exec
DELETE FROM schedules
WHERE id = ?;

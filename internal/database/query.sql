-- name: CreateUser :exec
INSERT INTO users (user_id, name)
VALUES (?, ?);

-- name: GetUsers :many
SELECT *
FROM users;

-- name: UpdateUserByID :exec
UPDATE users
SET name = ?
WHERE user_id = ?;

-- name: DeleteUserByID :exec
DELETE FROM users
WHERE user_id = ?;

-- name: GetSchedulesByUserID :many
SELECT schedule_id, role, day, clock_in, clock_out
FROM schedules
WHERE user_id = ?;

-- name: GetAllSchedules :many
SELECT schedules.schedule_id, schedules.user_id, schedules.role, schedules.day, 
schedules.clock_in, schedules.clock_out
FROM schedules
JOIN users ON schedules.user_id = users.user_id;

-- name: CreateSchedule :exec
INSERT INTO schedules (user_id, role, day, clock_in, clock_out)
VALUES (?, ?, ?, ?, ?);

-- name: UpdateScheduleTimes :exec
UPDATE schedules
SET role = ?, day = ?, clock_in = ?, clock_out = ?
WHERE schedule_id = ?;

-- name: DeleteSchedule :exec
DELETE FROM schedules
WHERE schedule_id = ?;

-- name: ShiftSchedules :exec
UPDATE schedules
SET 
    day = DATE(day, ?)
WHERE 
    schedule_id IN (?);


-- name: ShiftAllSchedules :exec
UPDATE schedules
SET 
    day = DATE(day, ?);

-- name: DeleteAllSchedulesBefore :exec
DELETE FROM schedules
WHERE day < ?;

-- name: DeleteAllSchedules :exec
DELETE FROM schedules;


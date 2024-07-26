-- name: GetUsers :many
SELECT *
FROM users;

-- name: GetSchedulesByUserID :many
SELECT id, week_start_date, day_of_week, clock_in, clock_out
FROM schedules
WHERE user_id = ?;

-- name: CreateSchedule :exec
INSERT INTO schedules (user_id, week_start_date, day_of_week, clock_in, clock_out)
VALUES (?, ?, ?, ?, ?);

-- name: UpdateScheduleTimes :exec
UPDATE schedules
SET clock_in = ?, clock_out = ?
WHERE id = ?;

-- name: DeleteSchedule :exec
DELETE FROM schedules
WHERE id = ?;

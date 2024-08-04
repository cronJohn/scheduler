-- name: GetUsers :many
SELECT *
FROM users;

-- name: GetSchedulesByUserID :many
SELECT id, week_start_date, day_of_week, clock_in, clock_out
FROM schedules
WHERE user_id = ?;

-- name: GetWeekSchedules :many
SELECT schedules.id, schedules.user_id as "userId", users.name, users.role, schedules.day_of_week as "dayOfWeek", schedules.clock_in as "clockIn", schedules.clock_out as "clockOut"
FROM schedules
JOIN users ON schedules.user_id = users.id
WHERE schedules.week_start_date = ?;

-- name: CreateSchedule :exec
INSERT INTO schedules (user_id, week_start_date, day_of_week, clock_in, clock_out)
VALUES (?, ?, ?, ?, ?);

-- name: UpdateScheduleTimes :exec
UPDATE schedules
SET clock_in = ?, clock_out = ?
WHERE id = ?;

-- name: UpdateWeekStartDateByUserID :exec
UPDATE schedules
SET week_start_date = ?
WHERE user_id = ?
  AND week_start_date = ?;

-- name: DeleteSchedule :exec
DELETE FROM schedules
WHERE id = ?;

-- name: DeleteSchedulesByIdAndWeekStartDate :exec
DELETE FROM schedules
WHERE user_id = ? AND week_start_date = ?;

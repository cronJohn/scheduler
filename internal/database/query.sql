-- name: GetUsers :many
SELECT *
FROM users;

-- name: GetSchedulesByUserID :many
SELECT id, week_start_date, day_of_week, clock_in, clock_out
FROM schedules
WHERE user_id = ?;

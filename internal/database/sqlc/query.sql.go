// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: query.sql

package sqlc

import (
	"context"
)

const createSchedule = `-- name: CreateSchedule :exec
INSERT INTO schedules (user_id, week_start_date, day_of_week, clock_in, clock_out)
VALUES (?, ?, ?, ?, ?)
`

type CreateScheduleParams struct {
	UserID        string `json:"user_id"`
	WeekStartDate string `json:"week_start_date"`
	DayOfWeek     int64  `json:"day_of_week"`
	ClockIn       string `json:"clock_in"`
	ClockOut      string `json:"clock_out"`
}

func (q *Queries) CreateSchedule(ctx context.Context, arg CreateScheduleParams) error {
	_, err := q.db.ExecContext(ctx, createSchedule,
		arg.UserID,
		arg.WeekStartDate,
		arg.DayOfWeek,
		arg.ClockIn,
		arg.ClockOut,
	)
	return err
}

const deleteSchedule = `-- name: DeleteSchedule :exec
DELETE FROM schedules
WHERE id = ?
`

func (q *Queries) DeleteSchedule(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteSchedule, id)
	return err
}

const getSchedulesByUserID = `-- name: GetSchedulesByUserID :many
SELECT id, week_start_date, day_of_week, clock_in, clock_out
FROM schedules
WHERE user_id = ?
`

type GetSchedulesByUserIDRow struct {
	ID            int64  `json:"id"`
	WeekStartDate string `json:"week_start_date"`
	DayOfWeek     int64  `json:"day_of_week"`
	ClockIn       string `json:"clock_in"`
	ClockOut      string `json:"clock_out"`
}

func (q *Queries) GetSchedulesByUserID(ctx context.Context, userID string) ([]GetSchedulesByUserIDRow, error) {
	rows, err := q.db.QueryContext(ctx, getSchedulesByUserID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetSchedulesByUserIDRow
	for rows.Next() {
		var i GetSchedulesByUserIDRow
		if err := rows.Scan(
			&i.ID,
			&i.WeekStartDate,
			&i.DayOfWeek,
			&i.ClockIn,
			&i.ClockOut,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUsers = `-- name: GetUsers :many
SELECT id, name, role
FROM users
`

func (q *Queries) GetUsers(ctx context.Context) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, getUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(&i.ID, &i.Name, &i.Role); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateScheduleTimes = `-- name: UpdateScheduleTimes :exec
UPDATE schedules
SET clock_in = ?, clock_out = ?
WHERE id = ?
`

type UpdateScheduleTimesParams struct {
	ClockIn  string `json:"clock_in"`
	ClockOut string `json:"clock_out"`
	ID       int64  `json:"id"`
}

func (q *Queries) UpdateScheduleTimes(ctx context.Context, arg UpdateScheduleTimesParams) error {
	_, err := q.db.ExecContext(ctx, updateScheduleTimes, arg.ClockIn, arg.ClockOut, arg.ID)
	return err
}

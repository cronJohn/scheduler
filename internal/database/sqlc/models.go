// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package sqlc

import (
	"database/sql"
)

type Employee struct {
	ID     string        `json:"id"`
	Name   string        `json:"name"`
	RoleID sql.NullInt64 `json:"role_id"`
}

type Role struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
}

type Schedule struct {
	ID         int64          `json:"id"`
	EmployeeID sql.NullInt64  `json:"employee_id"`
	DayOfWeek  sql.NullInt64  `json:"day_of_week"`
	ClockIn    sql.NullString `json:"clock_in"`
	ClockOut   sql.NullString `json:"clock_out"`
}

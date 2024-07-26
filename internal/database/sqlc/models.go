// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package sqlc

type Schedule struct {
	ID            int64  `json:"id"`
	UserID        string `json:"user_id"`
	WeekStartDate string `json:"week_start_date"`
	DayOfWeek     int64  `json:"day_of_week"`
	ClockIn       string `json:"clock_in"`
	ClockOut      string `json:"clock_out"`
}

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Role string `json:"role"`
}

package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/internal/database/sqlc"
)

type (
	dataMap      map[string]dayOfWeekMap
	dayOfWeekMap map[int64][]timeEntry
	timeEntry    struct {
		Id       int64  `json:"id"`
		ClockIn  string `json:"clockIn"`
		ClockOut string `json:"clockOut"`
	}
)

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	users, err := h.db.GetUsers(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to get users: %v", err)
		return
	}

	data, err := json.Marshal(users)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to marshal users: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func (h *Handler) GetUserSchedules(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	schedules, err := h.db.GetSchedulesByUserID(ctx, r.PathValue("id"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to get schedules: %v", err)
		return
	}

	if len(schedules) == 0 {
		w.WriteHeader(http.StatusNotFound)
		log.Info().Msgf("No schedules found for user '%v'", r.PathValue("id"))
		return
	}

	dataMap := make(dataMap)

	// Populate the map
	for _, sch := range schedules {
		if _, exists := dataMap[sch.WeekStartDate]; !exists {
			dataMap[sch.WeekStartDate] = make(dayOfWeekMap)
		}

		if _, exists := dataMap[sch.WeekStartDate][sch.DayOfWeek]; !exists {
			dataMap[sch.WeekStartDate][sch.DayOfWeek] = []timeEntry{}
		}

		dataMap[sch.WeekStartDate][sch.DayOfWeek] = append(
			dataMap[sch.WeekStartDate][sch.DayOfWeek],
			timeEntry{
				Id:       sch.ID,
				ClockIn:  sch.ClockIn,
				ClockOut: sch.ClockOut,
			},
		)
	}

	data, err := json.Marshal(dataMap)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to marshal schedules map: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func (h *Handler) CreateUserSchedule(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req struct {
		WeekStartDate string `json:"weekStartDate"`
		DayOfWeek     int64  `json:"dayOfWeek"`
		ClockIn       string `json:"clockIn"`
		ClockOut      string `json:"clockOut"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.db.CreateSchedule(ctx, sqlc.CreateScheduleParams{
		UserID:        r.PathValue("id"),
		WeekStartDate: req.WeekStartDate,
		DayOfWeek:     req.DayOfWeek,
		ClockIn:       req.ClockIn,
		ClockOut:      req.ClockOut,
	})
	if err != nil {
		http.Error(w, "Failed to create schedule", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) UpdateUserSchedule(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req struct {
		EntryID  int64  `json:"entryId"`
		ClockIn  string `json:"clockIn"`
		ClockOut string `json:"clockOut"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.db.UpdateScheduleTimes(ctx, sqlc.UpdateScheduleTimesParams{
		ID:       req.EntryID,
		ClockIn:  req.ClockIn,
		ClockOut: req.ClockOut,
	})
	if err != nil {
		http.Error(w, "Failed to update schedule", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) UpdateUserWeekStart(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req struct {
		OldWeekStartDate string `json:"oldWeekStartDate"`
		NewWeekStartDate string `json:"newWeekStartDate"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.db.UpdateWeekStartDateByUserID(ctx, sqlc.UpdateWeekStartDateByUserIDParams{
		WeekStartDate:   req.NewWeekStartDate,
		UserID:          r.PathValue("id"),
		WeekStartDate_2: req.OldWeekStartDate,
	})
	if err != nil {
		http.Error(w, "Failed to update week start date", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) DeleteUserSchedule(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req struct {
		EntryID int64 `json:"entryId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.db.DeleteSchedule(ctx, req.EntryID)
	if err != nil {
		http.Error(w, "Failed to delete schedule", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) DeleteUserWeekStart(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req struct {
		WeekStartDate string `json:"weekStartDate"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.db.DeleteSchedulesByIdAndWeekStartDate(
		ctx,
		sqlc.DeleteSchedulesByIdAndWeekStartDateParams{
			UserID:        r.PathValue("id"),
			WeekStartDate: req.WeekStartDate,
		},
	)
	if err != nil {
		http.Error(w, "Failed to delete week start date", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

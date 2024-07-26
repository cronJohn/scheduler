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
	DataMap      map[string]DayOfWeekMap
	DayOfWeekMap map[int64][]ClockInOut
	ClockInOut   struct {
		ID       int64
		ClockIn  string
		ClockOut string
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

func (h *Handler) GetUserSchedule(w http.ResponseWriter, r *http.Request) {
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

	dataMap := make(DataMap)

	// Populate the map
	for _, sch := range schedules {
		if _, exists := dataMap[sch.WeekStartDate]; !exists {
			dataMap[sch.WeekStartDate] = make(DayOfWeekMap)
		}

		if _, exists := dataMap[sch.WeekStartDate][sch.DayOfWeek]; !exists {
			dataMap[sch.WeekStartDate][sch.DayOfWeek] = []ClockInOut{}
		}

		dataMap[sch.WeekStartDate][sch.DayOfWeek] = append(
			dataMap[sch.WeekStartDate][sch.DayOfWeek],
			ClockInOut{
				ID:       sch.ID,
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

type ScheduleRequest struct {
	UserID        string `json:"user_id"`
	EntryID       int64  `json:"id"`
	WeekStartDate string `json:"week_start_date"`
	DayOfWeek     int64  `json:"day_of_week"`
	ClockIn       string `json:"clock_in"`
	ClockOut      string `json:"clock_out"`
}

func (h *Handler) CreateUserSchedule(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req ScheduleRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.db.CreateSchedule(ctx, sqlc.CreateScheduleParams{
		UserID:        req.UserID,
		WeekStartDate: req.WeekStartDate,
		DayOfWeek:     req.DayOfWeek,
		ClockIn:       req.ClockIn,
		ClockOut:      req.ClockOut,
	})
	if err != nil {
		http.Error(w, "Failed to update schedule", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) UpdateUserSchedule(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req ScheduleRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Info().
		Msgf("ClockIn: %v, ClockOut: %v UserID: %v EventID: %v", req.ClockIn, req.ClockOut, req.UserID, req.EntryID)

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

func (h *Handler) DeleteUserSchedule(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req ScheduleRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.db.DeleteSchedule(ctx, req.EntryID)
	if err != nil {
		http.Error(w, "Failed to update schedule", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

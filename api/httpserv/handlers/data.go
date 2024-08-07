package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/internal/database/sqlc"
)

type (
	timeEntry struct {
		Id       int64  `json:"id"`
		Day      string `json:"day"`
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

	userID := r.PathValue("id")
	if userID == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Error().Msg("User ID is missing in request")
		return
	}

	schedules, err := h.db.GetSchedulesByUserID(ctx, userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to get user schedules: %v", err)
		return
	}

	if len(schedules) == 0 {
		w.WriteHeader(http.StatusNotFound)
		log.Info().Msgf("No schedules found for user '%v'", userID)
		return
	}

	var entries []timeEntry
	for _, sch := range schedules {
		entries = append(entries, timeEntry{
			Id:       sch.ID,
			Day:      sch.Day,
			ClockIn:  sch.Clockin,
			ClockOut: sch.Clockout,
		})
	}

	data, err := json.Marshal(entries)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to marshal schedules: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func (h *Handler) GetAllSchedules(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	schedules, err := h.db.GetAllSchedules(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to get all schedules: %v", err)
		return
	}

	data, err := json.Marshal(schedules)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to marshal schedules: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func (h *Handler) CreateUserSchedule(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req struct {
		Day      string `json:"day"`
		ClockIn  string `json:"clockIn"`
		ClockOut string `json:"clockOut"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := r.PathValue("id")
	if userID == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Error().Msg("User ID is missing in request")
		return
	}

	err := h.db.CreateSchedule(ctx, sqlc.CreateScheduleParams{
		Userid:   userID,
		Day:      req.Day,
		Clockin:  req.ClockIn,
		Clockout: req.ClockOut,
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
		Day      string `json:"day"`
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
		Day:      req.Day,
		Clockin:  req.ClockIn,
		Clockout: req.ClockOut,
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

	entryID, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "Invalid entry ID", http.StatusBadRequest)
		return
	}

	err = h.db.DeleteSchedule(ctx, int64(entryID))
	if err != nil {
		http.Error(w, "Failed to delete schedule", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

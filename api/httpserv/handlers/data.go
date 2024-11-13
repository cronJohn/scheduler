package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/internal/database/sqlc"
)

func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req sqlc.CreateUserParams

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.UserID == "" {
		log.Error().Msg("User ID is missing in request")
		http.Error(w, "User ID is missing in request", http.StatusBadRequest)
		return
	}

	err := h.db.CreateUser(ctx, req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to create user: %v", err)
		return
	}

	log.Debug().Str("UserID", req.UserID).Str("Name", req.Name).Msg("User created")

	w.WriteHeader(http.StatusOK)
}

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

func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req sqlc.UpdateUserByIDParams

	req.UserID = strings.TrimSpace(r.PathValue("id"))

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err := h.db.UpdateUserByID(ctx, req)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to update user: %v", err)
		return
	}

	log.Debug().Str("UserID", req.UserID).Str("NewName", req.Name).Msg("User updated")

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userID := strings.TrimSpace(r.PathValue("id"))
	if userID == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Error().Msg("User ID is missing in request")
		return
	}

	err := h.db.DeleteUserByID(ctx, userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to delete user: %v", err)
		return
	}

	log.Debug().Str("UserID", userID).Msg("User deleted")

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) GetUserSchedules(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userID := strings.TrimSpace(r.PathValue("id"))
	if userID == "" || userID == "\x00" {
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
		w.WriteHeader(http.StatusOK)
		log.Info().Msgf("No schedules found for user '%v'", userID)
		return
	}

	var entries []sqlc.GetSchedulesByUserIDRow
	for _, sch := range schedules {
		entries = append(entries, sqlc.GetSchedulesByUserIDRow{
			ScheduleID: sch.ScheduleID,
			Role:       sch.Role,
			Day:        sch.Day,
			ClockIn:    sch.ClockIn,
			ClockOut:   sch.ClockOut,
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

	var req sqlc.CreateScheduleParams

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := strings.TrimSpace(r.PathValue("id"))
	if userID == "" || userID == "\x00" {
		w.WriteHeader(http.StatusBadRequest)
		log.Error().Msg("User ID is missing in request")
		return
	}

	req.UserID = userID

	err := h.db.CreateSchedule(ctx, req)
	if err != nil {
		http.Error(w, "Failed to create schedule", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) UpdateUserSchedule(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var req sqlc.UpdateScheduleTimesParams

	entryID, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		log.Error().Msgf("Invalid entry ID: %v", err)
		http.Error(w, "Invalid entry ID", http.StatusBadRequest)
		return
	}

	req.ScheduleID = int64(entryID)

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error().Msgf("Failed to decode request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.db.UpdateScheduleTimes(ctx, req)
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

type DeleteScheduleRequest struct {
	ScheduleIdList []int `json:"scheduleIdList"`
}

func (h *Handler) DeleteUserSchedules(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var requestBody DeleteScheduleRequest

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Bad delete request", http.StatusBadRequest)
		return
	}

	for _, id := range requestBody.ScheduleIdList {
		err = h.db.DeleteSchedule(ctx, int64(id))
		if err != nil {
			http.Error(w, "Failed to delete schedules", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
}

type ShiftScheduleRequest struct {
	ScheduleIdList []int  `json:"scheduleIdList"`
	ShiftAmount    string `json:"shiftAmount"`
}

func (h *Handler) ShiftSchedule(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var requestBody ShiftScheduleRequest

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Bad shift request", http.StatusBadRequest)
		return
	}

	for _, id := range requestBody.ScheduleIdList {
		err = h.db.ShiftSchedules(ctx, sqlc.ShiftSchedulesParams{
			ScheduleID: int64(id),
			Date:       requestBody.ShiftAmount,
		})
		if err != nil {
			http.Error(w, "Failed to shift schedule", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) ShiftAllSchedules(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	shiftAmount := r.PathValue("amount")

	if shiftAmount == "" {
		log.Error().Msg("Shift amount is empty")
		http.Error(w, "Shift amount is empty", http.StatusBadRequest)
	}

	err := h.db.ShiftAllSchedules(ctx, shiftAmount)
	if err != nil {
		log.Error().Msgf("Failed to shift all schedules: %v", err)
		http.Error(w, "Failed to shift schedule", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) DeleteAllSchedulesBefore(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	beforeDate := r.PathValue("date")

	if beforeDate == "" {
		log.Error().Msg("Before date is empty")
		http.Error(w, "Before date is empty", http.StatusBadRequest)
	}

	err := h.db.DeleteAllSchedulesBefore(ctx, beforeDate)
	if err != nil {
		log.Error().Msgf("Failed to delete all schedules before: %v", err)
		http.Error(w, "Failed to delete all schedules before", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) DeleteAllSchedules(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := h.db.DeleteAllSchedules(ctx)
	if err != nil {
		log.Error().Msgf("Failed to nuke db: %v", err)
		http.Error(w, "Failed to nuke db", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

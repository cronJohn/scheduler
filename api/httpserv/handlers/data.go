package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/cronJohn/scheduler/internal/database/sqlc"
)

func (h *Handler) GetUserSchedules(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	schedules, err := h.db.GetUserSchedules(ctx, r.PathValue("id"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to get user schedules: %v", err)
		return
	}

	if len(schedules) == 0 {
		w.WriteHeader(http.StatusNotFound)
		log.Info().Msgf("No schedules found for user '%v'", r.PathValue("id"))
		return
	}

	data, err := json.Marshal(schedules)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to marshal user schedules: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func (h *Handler) PostSchedule(w http.ResponseWriter, r *http.Request) {
	var schedules []sqlc.Schedule

	decoder := json.NewDecoder(r.Body)
	defer r.Body.Close()

	if err := decoder.Decode(&schedules); err != nil {
		http.Error(w, "Error parsing JSON", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err := h.db.ClearSchedules(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error().Msgf("Failed to clear schedules: %v", err)
		return
	}

	for _, schedule := range schedules {
		err := h.db.SetSchedule(ctx, sqlc.SetScheduleParams{
			ID:         schedule.ID,
			EmployeeID: schedule.EmployeeID,
			DayOfWeek:  schedule.DayOfWeek,
			ClockIn:    schedule.ClockIn,
			ClockOut:   schedule.ClockOut,
		})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			log.Error().Msgf("Failed to set schedule: %v", err)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) GetSubsheet(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Getting subsheet...</h1>")
}

func (h *Handler) PostSubrequest(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "<h1>Posting subrequest...</h1>")
}

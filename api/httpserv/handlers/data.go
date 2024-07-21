package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/rs/zerolog/log"
)

type (
	DataMap      map[string]DayOfWeekMap
	DayOfWeekMap map[int64][]ClockInOut
	ClockInOut   struct {
		ID       int64
		ClockIn  int64
		ClockOut int64
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

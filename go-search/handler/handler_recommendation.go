package handler

import (
	"encoding/json"
	"fmt"
	"go-search/helpers"
	"net/http"
)

func HandlerRecommendation(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		UserId string `json:"user_id"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}

	err := decoder.Decode(&params)

	if params.UserId == "" {
		helpers.RespondWithError(
			w,
			400,
			"user_id is required",
		)
		return
	}

	if err != nil {
		helpers.RespondWithError(w, 400, fmt.Sprintf("Error parsing JSON: %s", err))
		return
	}

	recs, err := Recommend(params.UserId)
	if err != nil {
		helpers.RespondWithError(
			w,
			500,
			err.Error(),
		)
		return
	}

	helpers.RespondWithJSON(w, 200, recs)

}

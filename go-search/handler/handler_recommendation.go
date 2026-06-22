package handler

import (
	"encoding/json"
	"fmt"
	"go-search/helpers"
	"go-search/recommendation"
	"net/http"
)

func HandlerRecommendation(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		UserId int64 `json:"user_id"`
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

	recs, err := recommendation.Recommend(params.UserId)
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

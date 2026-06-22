package handler

import (
	"go-search/helpers"
	"net/http"
)

func HandlerReadiness(w http.ResponseWriter, r *http.Request) {
	helpers.RespondWithJSON(w, 200, struct{}{})
}

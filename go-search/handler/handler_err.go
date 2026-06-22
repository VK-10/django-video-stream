package handler

import (
	"go-search/helpers"
	"net/http"
)

func HandleErr(w http.ResponseWriter, r *http.Request) {
	helpers.RespondWithError(w, 400, "Something went wrong")

}

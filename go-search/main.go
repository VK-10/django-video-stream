package main

import (
	"go-search/handler"
	"go-search/recommendation"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	ort "github.com/yalue/onnxruntime_go"
)

func InitModel() (*ort.DynamicAdvancedSession, error) {
	ort.SetSharedLibraryPath(
		`C:\Users\HP\go\pkg\mod\github.com\yalue\onnxruntime_go@v1.31.0\test_data\onnxruntime.dll`,
	)

	err := ort.InitializeEnvironment()
	if err != nil {
		panic(err)
	}

	return ort.NewDynamicAdvancedSession(
		"D:/side_projects/video-app/go-search/modelsmodel.onnx",
		[]string{"user_ids", "item_ids"},
		[]string{"scores"},
		nil,
	)

}

func main() {
	godotenv.Load(".env")

	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("PORT is not found in the environment")
	}

	session, err := InitModel()
	if err != nil {
		log.Fatal(err)
	}

	rec := &recommendation.Recommender{
		Session: session,
	}

	h := &handler.Handler{
		Recommender: rec,
	}

	router := chiNewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1Router := chi.NewRouter()

	v1Router.Get("/health", handler.HandlerReadiness)
	v1Router.Get("/err", handler.HandlerErr)

	v1Router.Post("/recommendations", h.HandlerRecommendation)

	router.Mount("/v1", v1Router)

	srv := &http.Server{
		Handler: router,
		Addr:    ":" + port,
	}

	log.Printf("Server starting on %v", srv.Addr)

	err = srv.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}

}

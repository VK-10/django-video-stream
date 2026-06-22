package main

import (
	"go-search/handler"
	"log"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	ort "github.com/yalue/onnxruntime_go"
)

// type RecommendationEngine struct {
// 	Session  *ort.AdvancedSession
// 	NumItems int
// }

// var recommender *RecommendationEngine

var Session *ort.DynamicAdvancedSession

func InitModel() error {
	ort.SetSharedLibraryPath(
		`C:\Users\HP\go\pkg\mod\github.com\yalue\onnxruntime_go@v1.31.0\test_data\onnxruntime.dll`,
	)

	err := ort.InitializeEnvironment()
	if err != nil {
		panic(err)
	}

	Session, err = ort.NewDynamicAdvancedSession(
		"D:/side_projects/video-app/go-search/modelsmodel.onnx",
		[]string{"user_ids", "item_ids"},
		[]string{"scores"},
		nil,
	)

	return err
}

func main() {
	godotenv.Load(".env")

	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("PORT is not found in the environment")
	}

	err := InitModel()
	if err != nil {
		log.Fatal(err)
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
	router.Mount("/v1", v1Router)

	v1Router.Get("/health", handler.HandlerReadiness)
	v1Router.Get("/err", handler.HandlerErr)

	v1Router.Post("/recommendations", handler.HandlerRecommendation)

}

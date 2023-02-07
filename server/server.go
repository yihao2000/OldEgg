package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/yihao2000/gqlgen-todos/graph"
	"github.com/yihao2000/gqlgen-todos/graph/config"
	"github.com/yihao2000/gqlgen-todos/graph/model"
)

const defaultPort = "8080"

func main() {
	// dsn := "host=localhost user=postgres password=admin dbname=tpaweb port=5432 sslmode=disable TimeZone=Asia/Shanghai"

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	//Defer Closing Database
	db := config.GetDB()
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	//Migrate table2 dari Model yang ada
	db.AutoMigrate(&model.User{})

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{DB: db}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

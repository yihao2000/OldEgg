package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/mux"

	"github.com/yihao2000/gqlgen-todos/config"
	"github.com/yihao2000/gqlgen-todos/directives"
	"github.com/yihao2000/gqlgen-todos/graph"
	"github.com/yihao2000/gqlgen-todos/graph/model"
	middlewares "github.com/yihao2000/gqlgen-todos/middleware"
)

const defaultPort = "8080"

func main() {
	// dsn := "host=localhost user=postgres password=admin dbname=tpaweb port=5432 sslmode=disable TimeZone=Asia/Shanghai"

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db := config.GetDB()

	//Migrate table2 dari Model yang ada
	db.AutoMigrate(&model.User{})

	router := mux.NewRouter()

	router.Use(middlewares.AuthMiddleware)

	c := graph.Config{Resolvers: &graph.Resolver{}}
	c.Directives.Auth = directives.Auth

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(c))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"

	"github.com/go-chi/chi"
	"github.com/rs/cors"
	"github.com/yihao2000/gqlgen-todos/config"
	"github.com/yihao2000/gqlgen-todos/directives"
	"github.com/yihao2000/gqlgen-todos/graph"
	"github.com/yihao2000/gqlgen-todos/graph/model"
	middlewares "github.com/yihao2000/gqlgen-todos/middleware"
	"github.com/yihao2000/gqlgen-todos/pkg/websocket"
)

const defaultPort = "8080"

func serveWS(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket endpoint reached")

	conn, err := websocket.Upgrade(w, r)

	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}
	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}
	pool.Register <- client
	client.Read()
}

func setupRoutes() {
	pool := websocket.NewPool()
	go pool.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWS(pool, w, r)
	})
}

func main() {
	// dsn := "host=localhost user=postgres password=admin dbname=tpaweb port=5432 sslmode=disable TimeZone=Asia/Shanghai"

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db := config.GetDB()

	//Migrate table2 dari Model yang ada
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.Promo{})
	db.AutoMigrate(&model.Brand{})
	db.AutoMigrate(&model.ProductGroup{})
	db.AutoMigrate(&model.Category{})
	db.AutoMigrate(&model.Shop{})
	db.AutoMigrate(&model.Product{})
	db.AutoMigrate(&model.Wishlist{})
	db.AutoMigrate(&model.WishlistDetail{})
	db.AutoMigrate(&model.Cart{})
	db.AutoMigrate(&model.SavedForLater{})
	db.AutoMigrate(&model.Review{})
	db.AutoMigrate(&model.Address{})
	db.AutoMigrate(&model.Shipping{})
	db.AutoMigrate(&model.TransactionHeader{})
	db.AutoMigrate(&model.TransactionDetail{})
	db.AutoMigrate(&model.PaymentType{})
	db.AutoMigrate(&model.WishlistFollower{})
	db.AutoMigrate(&model.WishlistReview{})
	db.AutoMigrate(&model.Voucher{})
	db.AutoMigrate(&model.ShopReview{})
	db.AutoMigrate(&model.UserSavedSearch{})
	db.AutoMigrate(&model.ShopReviewTag{})
	db.AutoMigrate(&model.ProductReview{})
	db.AutoMigrate(&model.Notification{})
	db.AutoMigrate(&model.CustomerServiceReview{})
	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedHeaders:   []string{"*"},
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8080"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	router.Use(middlewares.AuthMiddleware)

	c := graph.Config{Resolvers: &graph.Resolver{}}
	c.Directives.Auth = directives.Auth

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(c))

	// setupRoutes()

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

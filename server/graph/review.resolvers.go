package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"fmt"

	"github.com/yihao2000/gqlgen-todos/graph/model"
)

// CreateReview is the resolver for the createReview field.
func (r *mutationResolver) CreateReview(ctx context.Context, productID string, rating int, description string) (*model.Review, error) {
	panic(fmt.Errorf("not implemented: CreateReview - createReview"))
}

// Reviews is the resolver for the reviews field.
func (r *queryResolver) Reviews(ctx context.Context, productID string) ([]*model.Review, error) {
	panic(fmt.Errorf("not implemented: Reviews - reviews"))
}

// User is the resolver for the user field.
func (r *reviewResolver) User(ctx context.Context, obj *model.Review) (*model.User, error) {
	panic(fmt.Errorf("not implemented: User - user"))
}

// Product is the resolver for the product field.
func (r *reviewResolver) Product(ctx context.Context, obj *model.Review) (*model.Product, error) {
	panic(fmt.Errorf("not implemented: Product - product"))
}

// Review returns ReviewResolver implementation.
func (r *Resolver) Review() ReviewResolver { return &reviewResolver{r} }

type reviewResolver struct{ *Resolver }

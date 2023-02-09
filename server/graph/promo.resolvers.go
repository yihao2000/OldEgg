package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/yihao2000/gqlgen-todos/config"
	"github.com/yihao2000/gqlgen-todos/graph/model"
)

// CreatePromo is the resolver for the createPromo field.
func (r *mutationResolver) CreatePromo(ctx context.Context, input model.NewPromo) (*model.Promo, error) {
	db := config.GetDB()

	promo := model.Promo{
		ID:          uuid.New().String(),
		Name:        input.Name,
		Description: input.Description,
		Image:       input.Description,
	}

	if err := db.Model(promo).Create(&promo).Error; err != nil {
		return nil, err
	}

	return &promo, nil
}

// UpdatePromo is the resolver for the updatePromo field.
func (r *mutationResolver) UpdatePromo(ctx context.Context, input model.NewPromo) (*model.Promo, error) {
	panic(fmt.Errorf("not implemented: UpdatePromo - updatePromo"))
}

// Promos is the resolver for the promos field.
func (r *queryResolver) Promos(ctx context.Context) ([]*model.Promo, error) {
	db := config.GetDB()
	var models []*model.Promo
	return models, db.Find(&models).Error
}

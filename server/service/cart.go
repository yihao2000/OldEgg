package service

import (
	"context"

	"github.com/yihao2000/gqlgen-todos/config"
	"github.com/yihao2000/gqlgen-todos/graph/model"
)

func CartCreate(ctx context.Context, userID string, productID string, quantity int) (*model.Cart, error) {
	db := config.GetDB()

	cart := &model.Cart{
		UserID:    userID,
		ProductID: productID,
		Quantity:  quantity,
	}

	if err := db.Model(cart).Create(&cart).Error; err != nil {
		return nil, err
	}

	return cart, nil
}

func CartGetByUserProduct(ctx context.Context, userID string, productID string) (*model.Cart, error) {
	db := config.GetDB()

	var cart model.Cart

	if err := db.Model(cart).Where("user_id = ? AND product_id = ?", userID, productID).Take(&cart).Error; err != nil {
		return nil, err
	}

	return &cart, nil
}

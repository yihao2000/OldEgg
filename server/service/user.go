package service

import (
	"context"
	"strings"

	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"github.com/yihao2000/gqlgen-todos/config"
	"github.com/yihao2000/gqlgen-todos/graph/model"
)

func UserCreate(ctx context.Context, input model.NewUser) (*model.User, error) {
	db := config.GetDB()

	input.Password = model.HashPassword(input.Password)

	user := model.User{
		ID:                  uuid.New().String(),
		Name:                input.Name,
		Email:               strings.ToLower(input.Email),
		Password:            input.Password,
		Phone:               *input.Phone,
		Banned:              input.Banned,
		Role:                input.Role,
		Currency:            0,
		NewsLetterSubscribe: input.Newslettersubscribe,
		TwoFactorEnabled:    false,
		LocationID:          "10af47cb-546a-4662-88cb-d9ab1122cac0",
	}

	if err := db.Model(user).Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByID(ctx context.Context, id string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("id = ?", id).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByEmail(ctx context.Context, email string) (*model.User, error) {
	db := config.GetDB()

	var user model.User
	if err := db.Model(user).Where("email LIKE ?", email).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByToken(ctx context.Context) (*model.User, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, Invalid Token !",
		}
	}

	userID := ctx.Value("auth").(*JwtCustomClaim).ID

	var user model.User
	if err := db.Model(user).Where("id LIKE ?", userID).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

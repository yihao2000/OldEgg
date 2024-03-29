package service

import (
	"context"

	"github.com/yihao2000/gqlgen-todos/config"
	"github.com/yihao2000/gqlgen-todos/graph/model"

	"github.com/vektah/gqlparser/v2/gqlerror"
	"gorm.io/gorm"
)

func UserRegister(ctx context.Context, input model.NewUser) (interface{}, error) {
	// Check Email
	_, err := UserGetByEmail(ctx, input.Email)
	if err == nil {
		// if err != record not found
		if err != gorm.ErrRecordNotFound {
			return nil, err
		}
	}

	createdUser, err := UserCreate(ctx, input)
	if err != nil {
		return nil, err
	}

	token, err := JwtGenerate(ctx, createdUser.ID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"token": token,
	}, nil
}

func UserLogin(ctx context.Context, email string, password string) (interface{}, error) {
	getUser, err := UserGetByEmail(ctx, email)
	if err != nil {
		// if user not found
		if err == gorm.ErrRecordNotFound {
			return nil, &gqlerror.Error{
				Message: "Email not found",
			}
		}
		return nil, err
	}

	if err := model.ComparePassword(getUser.Password, password); err != nil {
		return nil, err
	}

	token, err := JwtGenerate(ctx, getUser.ID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"token": token,
	}, nil
}

func UserUpdateInformation(ctx context.Context, currentPassword *string, newPassword *string, phone *string, balance *float64, banned *bool) (*model.User, error) {
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

	if phone != nil {
		user.Phone = *phone
	}

	if balance != nil {
		user.Currency = *balance
	}

	if newPassword != nil && currentPassword != nil {
		if err := model.ComparePassword(user.Password, *currentPassword); err != nil {
			return nil, err
		} else {
			user.Password = model.HashPassword(*newPassword)
		}

	} else if newPassword != nil {
		user.Password = model.HashPassword(*newPassword)
	}

	return &user, db.Save(user).Error

}

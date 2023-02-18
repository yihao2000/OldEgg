package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"github.com/yihao2000/gqlgen-todos/config"
	"github.com/yihao2000/gqlgen-todos/graph/model"
	"github.com/yihao2000/gqlgen-todos/service"
)

// User is the resolver for the user field.
func (r *cartResolver) User(ctx context.Context, obj *model.Cart) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	return user, db.First(user, "id = ?", obj.UserID).Error
}

// Product is the resolver for the product field.
func (r *cartResolver) Product(ctx context.Context, obj *model.Cart) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)

	return product, db.Where("id = ?", obj.ProductID).Order("valid_to ASC").Limit(1).Find(&product).Error
}

// CreateCart is the resolver for the createCart field.
func (r *mutationResolver) CreateCart(ctx context.Context, productID string, quantity int) (*model.Cart, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Invalid Token !",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	cart, _ := service.CartGetByUserProduct(ctx, userID, productID)

	if cart != nil {
		cart.Quantity += quantity

		return cart, db.Save(cart).Error
	}
	return service.CartCreate(ctx, userID, productID, quantity)
}

// UpdateCart is the resolver for the updateCart field.
func (r *mutationResolver) UpdateCart(ctx context.Context, productID string, quantity int) (*model.Cart, error) {
	panic(fmt.Errorf("not implemented: UpdateCart - updateCart"))
}

// DeleteCart is the resolver for the deleteCart field.
func (r *mutationResolver) DeleteCart(ctx context.Context, productID string) (bool, error) {
	panic(fmt.Errorf("not implemented: DeleteCart - deleteCart"))
}

// CreateWishlist is the resolver for the createWishlist field.
func (r *mutationResolver) CreateWishlist(ctx context.Context, input model.NewWishlist) (*model.Wishlist, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	wishlist := model.Wishlist{
		ID:          uuid.New().String(),
		Name:        input.Name,
		UserID:      userID,
		Privacy:     input.Privacy,
		DateCreated: time.Now(),
	}

	if err := db.Model(wishlist).Create(&wishlist).Error; err != nil {
		return nil, nil
	}
	return &wishlist, nil
}

// UpdateWishlist is the resolver for the updateWishlist field.
func (r *mutationResolver) UpdateWishlist(ctx context.Context, input model.NewWishlist) (*model.Wishlist, error) {
	panic(fmt.Errorf("not implemented: UpdateWishlist - updateWishlist"))
}

// DeleteWishlist is the resolver for the deleteWishlist field.
func (r *mutationResolver) DeleteWishlist(ctx context.Context, wishlistID string) (bool, error) {
	panic(fmt.Errorf("not implemented: DeleteWishlist - deleteWishlist"))
}

// CreateWishlistDetail is the resolver for the createWishlistDetail field.
func (r *mutationResolver) CreateWishlistDetail(ctx context.Context, wishlistID string, productID string, quantity int) (*model.WishlistDetail, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	wishlist, _ := service.WishlistDetailGetByWishlistAndProduct(ctx, wishlistID, productID)

	if wishlist != nil {
		wishlist.Quantity = quantity

		return wishlist, db.Save(wishlist).Error
	}

	wishlist = &model.WishlistDetail{
		WishlistID: wishlistID,
		ProductID:  productID,
		Quantity:   quantity,
		DateAdded:  time.Now(),
	}

	return wishlist, db.Model(wishlist).Create(&wishlist).Error
}

// DeleteWishlistDetail is the resolver for the deleteWishlistDetail field.
func (r *mutationResolver) DeleteWishlistDetail(ctx context.Context, wishlistID string, productID string, quantity int) (bool, error) {
	panic(fmt.Errorf("not implemented: DeleteWishlistDetail - deleteWishlistDetail"))
}

// Cart is the resolver for the cart field.
func (r *queryResolver) Cart(ctx context.Context, productID string) (*model.Cart, error) {
	panic(fmt.Errorf("not implemented: Cart - cart"))
}

// Carts is the resolver for the carts field.
func (r *queryResolver) Carts(ctx context.Context) ([]*model.Cart, error) {
	panic(fmt.Errorf("not implemented: Carts - carts"))
}

// Wishlists is the resolver for the wishlists field.
func (r *queryResolver) Wishlists(ctx context.Context) ([]*model.Wishlist, error) {
	db := config.GetDB()

	var models []*model.Wishlist
	return models, db.Find(&models).Error
}

// Userwishlists is the resolver for the userwishlists field.
func (r *queryResolver) Userwishlists(ctx context.Context) ([]*model.Wishlist, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var models []*model.Wishlist
	return models, db.Where("user_id = ?", id).Find(&models).Error
}

// WishlistDetails is the resolver for the wishlistDetails field.
func (r *queryResolver) WishlistDetails(ctx context.Context, wishlistID string) ([]*model.WishlistDetail, error) {
	db := config.GetDB()

	var models []*model.WishlistDetail
	return models, db.Where("wishlist_id = ?  ", wishlistID).Find(&models).Error
}

// User is the resolver for the user field.
func (r *wishlistResolver) User(ctx context.Context, obj *model.Wishlist) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	return user, db.First(user, "id = ?", obj.UserID).Error
}

// WishlistDetails is the resolver for the wishlistDetails field.
func (r *wishlistResolver) WishlistDetails(ctx context.Context, obj *model.Wishlist) ([]*model.WishlistDetail, error) {
	panic(fmt.Errorf("not implemented: WishlistDetails - wishlistDetails"))
}

// Wishlist is the resolver for the wishlist field.
func (r *wishlistDetailResolver) Wishlist(ctx context.Context, obj *model.WishlistDetail) (*model.Wishlist, error) {
	db := config.GetDB()
	wishlist := new(model.Wishlist)

	return wishlist, db.First(wishlist, "id = ?", obj.WishlistID).Error
}

// Product is the resolver for the product field.
func (r *wishlistDetailResolver) Product(ctx context.Context, obj *model.WishlistDetail) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)

	return product, db.Where("id = ?", obj.ProductID).Order("valid_to ASC").Limit(1).Find(&product).Error
}

// Cart returns CartResolver implementation.
func (r *Resolver) Cart() CartResolver { return &cartResolver{r} }

// Wishlist returns WishlistResolver implementation.
func (r *Resolver) Wishlist() WishlistResolver { return &wishlistResolver{r} }

// WishlistDetail returns WishlistDetailResolver implementation.
func (r *Resolver) WishlistDetail() WishlistDetailResolver { return &wishlistDetailResolver{r} }

type cartResolver struct{ *Resolver }
type wishlistResolver struct{ *Resolver }
type wishlistDetailResolver struct{ *Resolver }

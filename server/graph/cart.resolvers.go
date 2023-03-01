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

	var product *model.Product
	if err := db.Where("id = ?", productID).Order("valid_to ASC").Limit(1).Find(&product).Error; err != nil {
		return nil, err
	}

	if quantity > product.Quantity {
		return nil, &gqlerror.Error{
			Message: "Invalid Purchased Product Stock!",
		}
	}
	if cart != nil {
		if cart.Quantity+quantity > product.Quantity {
			return nil, &gqlerror.Error{
				Message: "Invalid Purchased Product Stock!",
			}
		}
		cart.Quantity += quantity

		return cart, db.Save(cart).Error
	}
	return service.CartCreate(ctx, userID, productID, quantity)
}

// UpdateCart is the resolver for the updateCart field.
func (r *mutationResolver) UpdateCart(ctx context.Context, productID string, quantity int) (*model.Cart, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var cart model.Cart
	if err := db.Model(cart).Where("user_id LIKE ? AND product_id LIKE ?", userID, productID).Take(&cart).Error; err != nil {
		return nil, err
	}

	var product model.Product
	if err := db.Model(product).Where("id LIKE ?", productID).Take(&product).Error; err != nil {
		return nil, err
	}

	if quantity <= product.Quantity && quantity > 0 {
		cart.Quantity = quantity

		return &cart, db.Save(cart).Error
	}

	return nil, &gqlerror.Error{
		Message: "Error, Jumlah Product Ga nyampe !",
	}
}

// DeleteCart is the resolver for the deleteCart field.
func (r *mutationResolver) DeleteCart(ctx context.Context, productID string) (bool, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	model := new(model.Cart)
	if err := db.First(model, "user_id = ? AND product_id = ?", userID, productID).Error; err != nil {
		return false, err
	}

	return true, db.Delete(model).Error
}

// DeleteAllCart is the resolver for the deleteAllCart field.
func (r *mutationResolver) DeleteAllCart(ctx context.Context) (bool, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var models []*model.Cart
	if err := db.Where("user_id = ?", userID).Find(&models).Error; err != nil {
		return false, err
	}

	return true, db.Delete(&models).Error
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
		Notes:       "",
	}

	if err := db.Model(wishlist).Create(&wishlist).Error; err != nil {
		return nil, nil
	}
	return &wishlist, nil
}

// UpdateWishlist is the resolver for the updateWishlist field.
func (r *mutationResolver) UpdateWishlist(ctx context.Context, wishlistID string, input model.NewWishlist) (*model.Wishlist, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, Invalid Token !",
		}
	}

	var wishlist model.Wishlist
	if err := db.Model(wishlist).Where("id LIKE ?", wishlistID).Take(&wishlist).Error; err != nil {
		return nil, err
	}

	wishlist.Name = input.Name
	wishlist.Privacy = input.Privacy

	return &wishlist, db.Save(wishlist).Error
}

// DeleteWishlist is the resolver for the deleteWishlist field.
func (r *mutationResolver) DeleteWishlist(ctx context.Context, wishlistID string) (bool, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	model := new(model.Wishlist)
	if err := db.First(model, "id = ?", wishlistID).Error; err != nil {
		return false, err
	}

	return true, db.Delete(model).Error
}

// EditWishlistNote is the resolver for the editWishlistNote field.
func (r *mutationResolver) EditWishlistNote(ctx context.Context, wishlistID string, notes string) (*model.Wishlist, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	model := new(model.Wishlist)
	if err := db.First(model, "id = ?", wishlistID).Error; err != nil {
		return nil, err
	}

	model.Notes = notes

	return model, db.Save(&model).Error
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

// UpdateWishlistDetail is the resolver for the updateWishlistDetail field.
func (r *mutationResolver) UpdateWishlistDetail(ctx context.Context, productID string, wishlistID string, quantity int) (*model.WishlistDetail, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	// userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var wishlistdetail model.WishlistDetail
	if err := db.Model(wishlistdetail).Where("wishlist_id LIKE ? AND product_id LIKE ?", wishlistID, productID).Take(&wishlistdetail).Error; err != nil {
		return nil, err
	}

	var product model.Product
	if err := db.Model(product).Where("id LIKE ?", productID).Take(&product).Error; err != nil {
		return nil, err
	}

	if quantity <= product.Quantity && quantity > -1 {
		wishlistdetail.Quantity = quantity

		if quantity == 0 {
			return &wishlistdetail, db.Delete(wishlistdetail).Error
		}

		return &wishlistdetail, db.Save(wishlistdetail).Error
	}

	return nil, &gqlerror.Error{
		Message: "Error, Jumlah Product Ga nyampe !",
	}
}

// DeleteWishlistDetail is the resolver for the deleteWishlistDetail field.
func (r *mutationResolver) DeleteWishlistDetail(ctx context.Context, wishlistID string, productID string) (bool, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	model := new(model.WishlistDetail)
	if err := db.First(model, "wishlist_id = ? AND product_id = ?", wishlistID, productID).Error; err != nil {
		return false, err
	}

	return true, db.Delete(model).Error
}

// DeleteAllWishlistWishlistDetail is the resolver for the deleteAllWishlistWishlistDetail field.
func (r *mutationResolver) DeleteAllWishlistWishlistDetail(ctx context.Context, wishlistID string) (bool, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	var models []*model.WishlistDetail
	if err := db.Where("wishlist_id = ?", wishlistID).Find(&models).Error; err != nil {
		return false, err
	}

	return true, db.Delete(&models).Error
}

// DeleteProductFromWishlistDetails is the resolver for the deleteProductFromWishlistDetails field.
func (r *mutationResolver) DeleteProductFromWishlistDetails(ctx context.Context, productID string) (bool, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}
	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	mutation := fmt.Sprintf("DELETE FROM wishlist_details WHERE wishlist_id IN (SELECT id FROM wishlists WHERE user_id = '%s') AND product_id = '%s'", userID, productID)
	if err := db.Exec(mutation).Error; err != nil {
		return false, err
	}

	return true, nil
}

// CreateSavedForLater is the resolver for the createSavedForLater field.
func (r *mutationResolver) CreateSavedForLater(ctx context.Context, productID string, quantity int) (*model.SavedForLater, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	wishlist := &model.SavedForLater{
		UserID:    userID,
		ProductID: productID,
		Quantity:  quantity,
	}

	return wishlist, db.Model(wishlist).Create(&wishlist).Error
}

// DeleteSavedForLater is the resolver for the deleteSavedForLater field.
func (r *mutationResolver) DeleteSavedForLater(ctx context.Context, productID string) (bool, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	model := new(model.SavedForLater)
	if err := db.First(model, "user_id = ? AND product_id = ?", userID, productID).Error; err != nil {
		return false, err
	}

	return true, db.Delete(model).Error
}

// DeleteAllSavedForLater is the resolver for the deleteAllSavedForLater field.
func (r *mutationResolver) DeleteAllSavedForLater(ctx context.Context) (bool, error) {
	db := config.GetDB()
	if ctx.Value("auth") == nil {
		return false, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var models []*model.SavedForLater
	if err := db.Where("user_id = ?", userID).Find(&models).Error; err != nil {
		return false, err
	}

	return true, db.Delete(&models).Error
}

// Cart is the resolver for the cart field.
func (r *queryResolver) Cart(ctx context.Context, productID string) (*model.Cart, error) {
	panic(fmt.Errorf("not implemented: Cart - cart"))
}

// Carts is the resolver for the carts field.
func (r *queryResolver) Carts(ctx context.Context) ([]*model.Cart, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var models []*model.Cart
	return models, db.Where("user_id = ?", id).Order("product_id ASC").Find(&models).Error
}

// UpdateCart is the resolver for the updateCart field.
func (r *queryResolver) UpdateCart(ctx context.Context, userID string, productID string, quantity int) (*model.Cart, error) {
	panic(fmt.Errorf("not implemented: UpdateCart - updateCart"))
}

// Wishlists is the resolver for the wishlists field.
func (r *queryResolver) Wishlists(ctx context.Context, filter *string, sortBy *string, offset *int, limit *int) ([]*model.Wishlist, error) {
	db := config.GetDB()

	var models []*model.Wishlist
	temp := db.Model(models)

	if filter != nil {
		temp = temp.Where("privacy LIKE ?", filter)
	}

	if sortBy != nil {
		if *sortBy == "date_created" {
			temp = temp.Order("date_created ASC")
		}

	}

	if offset != nil {
		temp = temp.Offset(*offset)
	}

	if limit != nil {
		temp = temp.Limit(*limit)
	}

	return models, temp.Find(&models).Error
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
	return models, db.Where("wishlist_id = ?  ", wishlistID).Order("date_added ASC").Find(&models).Error
}

// ProductUserWishlists is the resolver for the productUserWishlists field.
func (r *queryResolver) ProductUserWishlists(ctx context.Context, productID string) ([]*model.Wishlist, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}
	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var models []*model.Wishlist

	if err := db.Raw("SELECT w.id, w.name, w.user_id, w.privacy, w.date_created FROM wishlists w JOIN wishlist_details wd ON wd.wishlist_id = w.id WHERE wd.product_id = ? AND w.user_id = ?", productID, userID).Scan(&models).Error; err != nil {
		return models, err
	}

	return models, nil
}

// Wishlist is the resolver for the wishlist field.
func (r *queryResolver) Wishlist(ctx context.Context, wishlistID string) (*model.Wishlist, error) {
	db := config.GetDB()
	wishlist := new(model.Wishlist)

	return wishlist, db.First(wishlist, "id = ?", wishlistID).Error
}

// SavedForLaters is the resolver for the savedForLaters field.
func (r *queryResolver) SavedForLaters(ctx context.Context) ([]*model.SavedForLater, error) {
	db := config.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, token gaada",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var models []*model.SavedForLater
	return models, db.Where("user_id = ?", id).Find(&models).Error
}

// User is the resolver for the user field.
func (r *savedForLaterResolver) User(ctx context.Context, obj *model.SavedForLater) (*model.User, error) {
	db := config.GetDB()
	user := new(model.User)

	return user, db.First(user, "id = ?", obj.UserID).Error
}

// Product is the resolver for the product field.
func (r *savedForLaterResolver) Product(ctx context.Context, obj *model.SavedForLater) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)

	return product, db.Where("id = ?", obj.ProductID).Order("valid_to ASC").Limit(1).Find(&product).Error
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

// SavedForLater returns SavedForLaterResolver implementation.
func (r *Resolver) SavedForLater() SavedForLaterResolver { return &savedForLaterResolver{r} }

// Wishlist returns WishlistResolver implementation.
func (r *Resolver) Wishlist() WishlistResolver { return &wishlistResolver{r} }

// WishlistDetail returns WishlistDetailResolver implementation.
func (r *Resolver) WishlistDetail() WishlistDetailResolver { return &wishlistDetailResolver{r} }

type cartResolver struct{ *Resolver }
type savedForLaterResolver struct{ *Resolver }
type wishlistResolver struct{ *Resolver }
type wishlistDetailResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *wishlistResolver) Notes(ctx context.Context, obj *model.Wishlist) (string, error) {
	panic(fmt.Errorf("not implemented: Notes - notes"))
}

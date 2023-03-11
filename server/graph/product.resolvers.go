package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"github.com/yihao2000/gqlgen-todos/config"
	"github.com/yihao2000/gqlgen-todos/graph/model"
)

// CreateBrand is the resolver for the createBrand field.
func (r *mutationResolver) CreateBrand(ctx context.Context, input model.NewBrand) (*model.Brand, error) {
	db := config.GetDB()

	// if ctx.Value("Role") == nil {
	// 	return nil, nil
	// }

	var brand model.Brand
	if err := db.Model(brand).Where("name LIKE ?", input.Name).Take(&brand).Error; err == nil {
		return nil, err
	} else {

		if ctx.Value("auth") == nil {
			return nil, &gqlerror.Error{
				Message: "Error, token gaada",
			}
		}

		brand := model.Brand{
			ID:          uuid.New().String(),
			Name:        input.Name,
			Description: input.Description,
			Image:       input.Image,
		}
		if err := db.Model(brand).Create(&brand).Error; err != nil {
			return nil, err
		}

		return &brand, nil
	}
}

// UpdateBrand is the resolver for the updateBrand field.
func (r *mutationResolver) UpdateBrand(ctx context.Context, input model.NewBrand, lastUpdateID string) (*model.Brand, error) {
	db := config.GetDB()

	brand := new(model.Brand)

	err := db.First(brand, "id = ?", lastUpdateID).Error
	if err != nil {
		return nil, err
	}

	brand.Name = input.Name
	brand.Description = input.Description

	db.Save(brand)

	return brand, nil
}

// CreateCategory is the resolver for the createCategory field.
func (r *mutationResolver) CreateCategory(ctx context.Context, input model.NewCategory) (*model.Category, error) {
	db := config.GetDB()

	// if ctx.Value("Role") == nil {
	// 	return nil, nil
	// }

	var category model.Category
	if err := db.Model(category).Where("name LIKE ?", input.Name).Take(&category).Error; err == nil {
		return nil, err
	} else {
		category := model.Category{
			ID:          uuid.New().String(),
			Name:        input.Name,
			Description: input.Description,
		}
		if err := db.Model(category).Create(&category).Error; err != nil {
			return nil, err
		}

		return &category, nil
	}
}

// UpdateCategory is the resolver for the updateCategory field.
func (r *mutationResolver) UpdateCategory(ctx context.Context, input model.NewCategory, lastUpdateID string) (*model.Category, error) {
	panic(fmt.Errorf("not implemented: UpdateCategory - updateCategory"))
}

// CreateProductGroup is the resolver for the createProductGroup field.
func (r *mutationResolver) CreateProductGroup(ctx context.Context) (*model.ProductGroup, error) {
	db := config.GetDB()

	productGroup := model.ProductGroup{
		ID: uuid.New().String(),
	}
	if err := db.Model(productGroup).Create(&productGroup).Error; err != nil {
		return nil, err
	}
	return &productGroup, nil
}

// CreateProduct is the resolver for the createProduct field.
func (r *mutationResolver) CreateProduct(ctx context.Context, input model.NewProduct) (*model.Product, error) {
	db := config.GetDB()

	var product model.Product
	if err := db.Model(product).Where("name LIKE ?", input.Name).Take(&product).Error; err == nil {
		return nil, err
	} else {
		createdProductGroup, err := r.CreateProductGroup(ctx)
		if err != nil {
			return nil, err
		}

		product := model.Product{
			ID:             uuid.New().String(),
			Name:           input.Name,
			Description:    input.Description,
			ProductgroupId: createdProductGroup.ID,
			BrandId:        input.BrandID,
			CategoryId:     input.CategoryID,
			ShopId:         input.ShopID,
			Price:          input.Price,
			Image:          input.Image,
			Quantity:       input.Quantity,
			ValidTo:        input.ValidTo,
			Discount:       input.Discount,
			Rating:         0,
		}
		if err := db.Model(product).Create(&product).Error; err != nil {
			return nil, err
		}

		return &product, nil
	}
}

// UpdateProduct is the resolver for the updateProduct field.
func (r *mutationResolver) UpdateProduct(ctx context.Context, productID string, input model.NewProduct) (*model.Product, error) {
	db := config.GetDB()

	product := new(model.Product)

	err := db.First(product, "id = ?", productID).Error
	if err != nil {
		return nil, err
	}

	product.Name = input.Name
	product.BrandId = input.BrandID
	product.CategoryId = input.CategoryID
	product.ShopId = input.ShopID
	product.Description = input.Description
	product.Price = input.Price
	product.Image = input.Image
	product.Quantity = input.Quantity
	product.Discount = input.Discount

	db.Save(product)

	return product, nil
}

// CreateProductVariant is the resolver for the createProductVariant field.
func (r *mutationResolver) CreateProductVariant(ctx context.Context, input model.NewProductVariant) (*model.Product, error) {
	panic(fmt.Errorf("not implemented: CreateProductVariant - createProductVariant"))
}

// UpdateProductVariant is the resolver for the updateProductVariant field.
func (r *mutationResolver) UpdateProductVariant(ctx context.Context, input model.NewProductVariant, lastUpdateID string) (*model.Product, error) {
	panic(fmt.Errorf("not implemented: UpdateProductVariant - updateProductVariant"))
}

// Productgroup is the resolver for the productgroup field.
func (r *productResolver) Productgroup(ctx context.Context, obj *model.Product) (*model.ProductGroup, error) {
	db := config.GetDB()
	productgroupmodel := new(model.ProductGroup)

	return productgroupmodel, db.Where("id = ?", obj.ProductgroupId).Limit(1).Find(&productgroupmodel).Error
}

// Brand is the resolver for the brand field.
func (r *productResolver) Brand(ctx context.Context, obj *model.Product) (*model.Brand, error) {
	db := config.GetDB()
	brand := new(model.Brand)

	return brand, db.First(brand, "id = ?", obj.BrandId).Error
}

// Category is the resolver for the category field.
func (r *productResolver) Category(ctx context.Context, obj *model.Product) (*model.Category, error) {
	db := config.GetDB()
	category := new(model.Category)

	return category, db.First(category, "id = ?", obj.CategoryId).Error
}

// Shop is the resolver for the shop field.
func (r *productResolver) Shop(ctx context.Context, obj *model.Product) (*model.Shop, error) {
	db := config.GetDB()
	shop := new(model.Shop)

	return shop, db.First(shop, "id = ?", obj.ShopId).Error
}

// Reviews is the resolver for the reviews field.
func (r *productResolver) Reviews(ctx context.Context, obj *model.Product) ([]*model.Review, error) {
	db := config.GetDB()
	var models []*model.Review
	return models, db.Where("product_id = ?", obj.ID).Order("created_at DESC").Find(&models).Error
}

// Brands is the resolver for the brands field.
func (r *queryResolver) Brands(ctx context.Context) ([]*model.Brand, error) {
	db := config.GetDB()
	var models []*model.Brand
	return models, db.Find(&models).Error
}

// Brand is the resolver for the brand field.
func (r *queryResolver) Brand(ctx context.Context, id *string, name *string) (*model.Brand, error) {
	panic(fmt.Errorf("not implemented: Brand - brand"))
}

// PopularBrands is the resolver for the popularBrands field.
func (r *queryResolver) PopularBrands(ctx context.Context) ([]*model.Brand, error) {
	db := config.GetDB()

	var models []*model.Brand

	temp := db.Model(models)
	temp = temp.Select("brands.id, brands.name, brands.description, brands.image").Joins("LEFT JOIN products ON products.brand_id = brands.id LEFT JOIN transaction_details ON transaction_details.product_id = products.id").Group("brands.id").Order("COUNT(transaction_details) DESC").Limit(10)

	return models, temp.Find(&models).Error
}

// Categories is the resolver for the categories field.
func (r *queryResolver) Categories(ctx context.Context) ([]*model.Category, error) {
	db := config.GetDB()
	var models []*model.Category
	return models, db.Find(&models).Error
}

// Category is the resolver for the category field.
func (r *queryResolver) Category(ctx context.Context, id *string, name *string) (*model.Category, error) {
	panic(fmt.Errorf("not implemented: Category - category"))
}

// Products is the resolver for the products field.
func (r *queryResolver) Products(ctx context.Context, shopID *string, brandID *string, categoryID *string, limit *int, offset *int, productGroupID *string, search *model.SearchProduct) ([]*model.Product, error) {
	db := config.GetDB()

	var models []*model.Product

	temp := db.Model(models).Where("valid_to IS NULL")

	if offset != nil {
		temp = temp.Offset(*offset)
	}

	if limit != nil {
		temp = temp.Limit(*limit)
	}

	if productGroupID != nil {
		temp = temp.Where("productgroup_id = ?", productGroupID)
	}

	if categoryID != nil {
		temp = temp.Where("category_id = ?", categoryID).Order("RANDOM()")
	}

	if search != nil {
		if search.IsDiscount != nil && *search.IsDiscount {
			temp = temp.Order("discount DESC").Limit(15)
		} else {
			if search.HighRating != nil && *search.HighRating {
				temp = temp.Select("products.id, name, products.description, price, discount, metadata, category_id, shop_id, products.created_at, stock, original_product_id, valid_to").Joins("JOIN reviews ON products.id = reviews.product_id").Group("products.id").Having("AVG(reviews.rating) >= 4")
			}
			if search.MinPrice != nil {
				temp = temp.Where("price >= ?", *search.MinPrice)
			}
			if search.MaxPrice != nil {
				temp = temp.Where("price <= ?", *search.MaxPrice)
			}
			if search.Keyword != nil {
				temp = temp.Joins("JOIN brands ON brands.id = products.brand_id").Where("products.name LIKE ? OR brands.name LIKE ?", "%"+*search.Keyword+"%", "%"+*search.Keyword+"%")
			}
			if search.CategoryID != nil {
				temp = temp.Where("category_id = ?", *search.CategoryID)
			}
			if search.OrderBy != nil {
				if *search.OrderBy == "newest" {
					temp = temp.Order("products.created_at DESC")
				} else if *search.OrderBy == "highestprice" {
					temp = temp.Order("price DESC")
				} else if *search.OrderBy == "lowestprice" {
					temp = temp.Order("price ASC")
				} else if *search.OrderBy == "highestrating" {
					temp = temp.Order("rating DESC")
				} else if *search.OrderBy == "lowestrating" {
					temp = temp.Order("rating ASC")
				} else if *search.OrderBy == "mostreviews" {

				}
			}

			if search.CreatedAtRange != nil {
				temp = temp.Where("DATEDIFF(NOW(), products.created_at) <= ?", *search.CreatedAtRange)
			}

		}
	}
	if limit != nil {
		temp = temp.Limit(*limit)
	}

	return models, temp.Find(&models).Error
}

// Product is the resolver for the product field.
func (r *queryResolver) Product(ctx context.Context, id *string, name *string) (*model.Product, error) {
	db := config.GetDB()
	product := new(model.Product)

	return product, db.Where("id = ?", id).Order("valid_to ASC").Limit(1).Find(&product).Error
}

// ProductsGroup is the resolver for the productsGroup field.
func (r *queryResolver) ProductsGroup(ctx context.Context, category *string, brand *string, productgroup *string, shop *string) ([]*model.Product, error) {
	panic(fmt.Errorf("not implemented: ProductsGroup - productsGroup"))
}

// SearchProductsRecommendations is the resolver for the searchProductsRecommendations field.
func (r *queryResolver) SearchProductsRecommendations(ctx context.Context, keyword string) ([]*model.Product, error) {
	db := config.GetDB()

	var models []*model.Product

	err := db.Joins("JOIN brands ON brands.id = products.brand_id").Where("products.name LIKE ? OR brands.name LIKE ?", "%"+keyword+"%", "%"+keyword+"%").Limit(5).Find(&models).Error

	if err != nil {
		return nil, err
	}

	return models, nil
}

// ProductGroup is the resolver for the productGroup field.
func (r *queryResolver) ProductGroup(ctx context.Context, id *string) (*model.ProductGroup, error) {
	db := config.GetDB()
	productGroup := new(model.ProductGroup)

	return productGroup, db.Where("id = ?", id).Limit(1).Find(&productGroup).Error
}

// Product returns ProductResolver implementation.
func (r *Resolver) Product() ProductResolver { return &productResolver{r} }

type productResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *productResolver) Rating(ctx context.Context, obj *model.Product) (float64, error) {
	panic(fmt.Errorf("not implemented: Rating - rating"))
}
func (r *productResolver) Discount(ctx context.Context, obj *model.Product) (float64, error) {
	panic(fmt.Errorf("not implemented: Discount - discount"))
}
func (r *productResolver) Review(ctx context.Context, obj *model.Product) ([]*model.Review, error) {
	panic(fmt.Errorf("not implemented: Review - review"))
}

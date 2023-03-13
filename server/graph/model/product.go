package model

import "time"

type Brand struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type Product struct {
	ID string `json:"id"`

	ProductgroupId string
	Productgroup   *ProductGroup `json:"productgroup" gorm:"foreignKey:ProductgroupId"`

	BrandId string
	Brand   *Brand `json:"brand" gorm:"foreignKey:BrandId"`

	CategoryId string
	Category   *Category `json:"category" gorm:"foreignKey:CategoryId"`

	ShopId string
	Shop   *Shop `json:"shop"`

	Name        string     `json:"name"`
	Description string     `json:"description"`
	Price       float64    `json:"price"`
	Image       string     `json:"image"`
	Quantity    int        `json:"quantity"`
	ValidTo     *time.Time `json:"validTo"`
	Discount    float64    `json:"discount"`
	Rating      float64    `json:"rating"`
}

type ProductGroup struct {
	ID string `json:"id"`
}

type Category struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type ProductReview struct {
	ProductID string   `json:"productID" gorm:"primaryKey"`
	Product   *Product `json:"product"`
	UserID    string   `json:"userID" gorm:"primaryKey"`
	User      *User    `json:"user"`
	Rating    float64  `json:"rating"`
	Title     string   `json:"title"`
	Comment   string   `json:"comment"`
}

package model

import "time"

type Brand struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
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
	Price       int        `json:"price"`
	Image       string     `json:"image"`
	Quantity    int        `json:"quantity"`
	ValidTo     *time.Time `json:"validTo"`
}

type ProductGroup struct {
	ID string `json:"id"`
}

type Category struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

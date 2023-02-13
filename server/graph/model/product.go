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
}

type ProductGroup struct {
	ID string `json:"id"`
}

type Category struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

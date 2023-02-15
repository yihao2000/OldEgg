// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"time"
)

type AuthOps struct {
	Login    interface{} `json:"login"`
	Register interface{} `json:"register"`
}

type NewBrand struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type NewCategory struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type NewProduct struct {
	BrandID     string     `json:"brandId"`
	CategoryID  string     `json:"categoryId"`
	ShopID      string     `json:"shopId"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Price       float64    `json:"price"`
	Image       string     `json:"image"`
	Quantity    int        `json:"quantity"`
	ValidTo     *time.Time `json:"validTo"`
}

type NewProductVariant struct {
	ProductgroupID string     `json:"productgroupId"`
	BrandID        string     `json:"brandId"`
	CategoryID     string     `json:"categoryId"`
	ShopID         string     `json:"shopId"`
	Name           string     `json:"name"`
	Description    string     `json:"description"`
	Price          float64    `json:"price"`
	Image          string     `json:"image"`
	Quantity       int        `json:"quantity"`
	ValidTo        *time.Time `json:"validTo"`
}

type NewPromo struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type NewShop struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Aboutus     string `json:"aboutus"`
}

type NewUser struct {
	Name     string  `json:"name"`
	Email    string  `json:"email"`
	Phone    *string `json:"phone"`
	Password string  `json:"password"`
	Banned   bool    `json:"banned"`
	Role     string  `json:"role"`
}

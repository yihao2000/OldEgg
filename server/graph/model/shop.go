package model

import "time"

type Shop struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Aboutus     string `json:"aboutus"`
	Banner      string `json:"banner"`
	Banned      bool   `json:"banned"`
	UserID      string
	User        *User `json:"user" gorm:"foreignKey:UserID"`
}

type ShopReview struct {
	ID                  string `json:"id"`
	TransactionHeaderID string
	TransactionHeader   *TransactionHeader `json:"transactionheader" gorm:"foreignKey:TransactionHeaderID"`
	ShopID              string
	Shop                *Shop `json:"shop" gorm:"foreignKey:ShopID"`
	UserID              string
	User                *User     `json:"user" gorm:"foreignKey:UserID"`
	Rating              float64   `json:"rating"`
	Tag                 *string   `json:"tag"`
	DateCreated         time.Time `json:"dateCreated"`
	Comment             string    `json:"comment"`
	OnTimeDelivery      bool      `json:"onTimeDelivery"`
	ProductAccurate     bool      `json:"productAccurate"`
	SatisfiedService    bool      `json:"satisfiedService"`
}

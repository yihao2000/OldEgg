package model

import "time"

type Review struct {
	ID          string `json:"id"`
	UserID      string
	User        *User `json:"user" gorm:"foreignKey:UserID"`
	ProductID   string
	Product     *Product  `json:"product" gorm:"foreignKey:ProductID"`
	CreatedAt   time.Time `json:"createdAt"`
	Rating      int       `json:"rating"`
	Description string    `json:"description"`
}

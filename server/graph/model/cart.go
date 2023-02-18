package model

import "time"

type Cart struct {
	UserID    string   `json:"userID" gorm:"primaryKey"`
	User      *User    `json:"user" gorm:"foreignKey:UserID"`
	ProductID string   `json:"productID" gorm:"primaryKey"`
	Product   *Product `json:"product" gorm:"foreignKey:ProductID"`
	Quantity  int      `json:"quantity"`
}

type Wishlist struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	UserID      string
	User        *User     `json:"user" gorm:"foreignKey:UserID"`
	Privacy     string    `json:"privacy"`
	DateCreated time.Time `json:"dateCreated"`
}

type WishlistDetail struct {
	WishlistID string    `json:"wishlistID" gorm:"primaryKey"`
	Wishlist   *Wishlist `json:"wishlist" gorm:"foreignKey:WishlistID"`
	ProductID  string    `json:"productID" gorm:"primaryKey"`
	Product    *Product  `json:"product" gorm:"foreignKey:ProductID"`
	Quantity   int       `json:"quantity"`
	DateAdded  time.Time `json:"dateAdded"`
}

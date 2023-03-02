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
	Notes       string
}

type WishlistDetail struct {
	WishlistID string    `json:"wishlistID" gorm:"primaryKey"`
	Wishlist   *Wishlist `json:"wishlist" gorm:"foreignKey:WishlistID"`
	ProductID  string    `json:"productID" gorm:"primaryKey"`
	Product    *Product  `json:"product" gorm:"foreignKey:ProductID"`
	Quantity   int       `json:"quantity"`
	DateAdded  time.Time `json:"dateAdded"`
}

type WishlistFollower struct {
	WishlistID string    `json:"wishlistID" gorm:"primaryKey"`
	Wishlist   *Wishlist `json:"wishlist" gorm:"foreignKey:WishlistID"`
	UserID     string    `json:"userID" gorm:"primaryKey"`
	User       *User     `json:"user" gorm:"foreignKey:UserID"`
	DateAdded  time.Time `json:"dateAdded"`
}

type SavedForLater struct {
	UserID    string   `json:"userID" gorm:"primaryKey"`
	User      *User    `json:"user"`
	ProductID string   `json:"productID" gorm:"primaryKey"`
	Product   *Product `json:"product"`
	Quantity  int      `json:"quantity"`
}

type WishlistReview struct {
	ID         string    `json:"id" gorm:"primaryKey"`
	WishlistID string    `json:"wishlistID" gorm:"primaryKey"`
	Wishlist   *Wishlist `json:"wishlist"`
	UserID     string    `json:"userID"`
	User       *User     `json:"user" gorm:"foreignKey:UserID"`
	CustomName string    `json:"customName"`
	Rating     float64   `json:"rating"`
	Title      string    `json:"title"`
	Comment    string    `json:"comment"`
}

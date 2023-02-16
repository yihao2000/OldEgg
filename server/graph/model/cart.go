package model

type Cart struct {
	UserID    string   `json:"userID" gorm:"primaryKey"`
	User      *User    `json:"user" gorm:"foreignKey:UserID"`
	ProductID string   `json:"productID" gorm:"primaryKey"`
	Product   *Product `json:"product" gorm:"foreignKey:ProductID"`
	Quantity  int      `json:"quantity"`
}

type Wishlist struct {
	UserID    string   `json:"userID" gorm:"primaryKey"`
	User      *User    `json:"user" gorm:"foreignKey:UserID"`
	ProductID string   `json:"productID" gorm:"primaryKey"`
	Product   *Product `json:"product" gorm:"foreignKey:ProductID"`
}

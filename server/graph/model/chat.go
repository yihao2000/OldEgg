package model

import "time"

type UserChat struct {
	ID       string    `json:"id"`
	SellerID string    `json:"sellerID"`
	Seller   *User     `json:"seller"`
	UserID   string    `json:"userID"`
	User     *User     `json:"user"`
	Time     time.Time `json:"time"`
}

type UserChatImage struct {
	ID         string    `json:"id" gorm:"primaryKey"`
	UserChatID string    `json:"userChatID"`
	UserChat   *UserChat `json:"userChat"`
	Image      string    `json:"image"`
	Type       string    `json:"type"`
	Time       time.Time `json:"time"`
}

type UserChatMessage struct {
	ID         string    `json:"id" gorm:"primaryKey"`
	UserChatID string    `json:"userChatID"`
	UserChat   *UserChat `json:"userChat"`
	Message    string    `json:"message"`
	Type       string    `json:"type"`
	Time       time.Time `json:"time"`
}

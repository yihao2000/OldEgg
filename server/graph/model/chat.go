package model

import "time"

type UserChat struct {
	SenderID   string    `json:"senderID" gorm:"primaryKey"`
	ReceiverID string    `json:"receiverID" gorm:"primaryKey"`
	Message    string    `json:"message"`
	Time       time.Time `json:"time"`
}

type UserChatImage struct {
	SenderID   string    `json:"senderID" gorm:"primaryKey"`
	ReceiverID string    `json:"receiverID" gorm:"primaryKey"`
	Image      string    `json:"image"`
	Time       time.Time `json:"time"`
}

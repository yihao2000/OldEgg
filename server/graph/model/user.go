package model

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID                        string     `json:"id"`
	Name                      string     `json:"name"`
	Email                     string     `json:"email"`
	Phone                     string     `json:"phone"`
	Password                  string     `json:"password"`
	Banned                    bool       `json:"banned"`
	Role                      string     `json:"role"`
	VerificationCode          string     `json:"verificationcode"`
	VerificationCodeValidTime *time.Time `json:"verificationcodevalidtime"`
	NewsLetterSubscribe       bool       `json:"newslettersubscribe"`
	Currency                  float64    `json:"currency"`
	LocationID                string
	Location                  *Location `json:"location" gorm:"foreignKey:LocationID"`
}
type Voucher struct {
	ID          string     `json:"id"`
	Balance     float64    `json:"balance"`
	DateCreated time.Time  `json:"dateCreated"`
	DateUsed    *time.Time `json:"dateUsed"`
}

func HashPassword(s string) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(s), bcrypt.DefaultCost)
	return string(hashed)
}

func ComparePassword(hashed string, normal string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(normal))
}

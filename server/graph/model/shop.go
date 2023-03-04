package model

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

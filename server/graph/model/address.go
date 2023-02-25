package model

type Address struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Detail    string `json:"detail"`
	Region    string `json:"region"`
	ZipCode   string `json:"zipCode"`
	Phone     string `json:"Phone"`
	City      string `json:"city"`
	IsPrimary bool   `json:"isPrimary"`
	UserID    string
	User      *User `json:"user" gorm:"foreignKey:UserID"`
}

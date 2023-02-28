package model

import "time"

type Shipping struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Price       int    `json:"price"`
	Description string `json:"description"`
}

type PaymentType struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type TransactionHeader struct {
	ID              string    `json:"id"`
	TransactionDate time.Time `json:"transactionDate"`
	UserID          string
	User            *User `json:"user" gorm:"foreignKey:UserID"`
	ShippingID      string
	Shipping        *Shipping `json:"shipping" gorm:"foreignKey:ShippingID"`
	PaymentTypeID   string
	PaymentType     *PaymentType `json:"paymentType" gorm:"foreignKey:PaymentTypeID"`
	Status          string       `json:"status"`
	AddressID       string
	Address         *Address `json:"address" gorm:"foreignKey:AddressID"`
	Invoice         string
}

type TransactionDetail struct {
	TransactionHeaderID string             `json:"transactionHeaderID" gorm:"primaryKey"`
	TransactionHeader   *TransactionHeader `json:"transactionHeader" gorm:"foreignKey:TransactionHeaderID"`
	ProductID           string             `json:"productID" gorm:"primaryKey"`
	Product             *Product           `json:"product" gorm:"foreignKey:ProductID"`
	Quantity            int                `json:"quantity"`
}

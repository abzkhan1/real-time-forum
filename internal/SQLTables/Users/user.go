package users

import (
	"database/sql"
	"fmt"
)

type UserData struct {
	Data *sql.DB
}

func CreateUserTable(db *sql.DB) *UserData {
	stmt, _ := db.Prepare(`
	CREATE TABLE IF NOT EXISTS "user" (
		"firstName"	TEXT,
		"lastName"	TEXT,
		"dateOfBirth" TEXT,
		"gender" TEXT,
		"username"	TEXT UNIQUE,
		"email"	TEXT NOT NULL UNIQUE,
		"password"	TEXT NOT NULL,
		PRIMARY KEY("username")
	);
`)
	stmt.Exec()

	return &UserData{
		Data: db,
	}
}

func (user *UserData) Add(userFields UserFields) error {
	fmt.Println("check for addition", userFields)
	stmt, _ := user.Data.Prepare(`
	INSERT INTO "user" (firstName, lastName, dateOfBirth, gender, username, email, password) values (?, ?, ?, ?, ?, ?, ?)
	`)
	_, err := stmt.Exec(userFields.FirstName, userFields.LastName, userFields.DateOfBirth, userFields.Gender, userFields.Username, userFields.Email, userFields.Password)
	if err != nil {
		return err
	}
	return nil
}

// func (user *UserData) Get() []UserFields {
// 	sliceOfUserTableRows := []UserFields{}
// 	rows, _ := user.Data.Query(`
// 	SELECT * FROM "user"
// 	`)
// 	var firstName, lastName, dateOfBirth, gender, username, email, password string

// 	for rows.Next() {
// 		rows.Scan(&firstName, &lastName, &dateOfBirth, &gender, &username, &email, &password)
// 		userTableRows := UserFields{
// 			FirstName:   firstName,
// 			LastName:    lastName,
// 			DateOfBirth: dateOfBirth,
// 			Gender:      gender,
// 			Username:    username,
// 			Email:       email,
// 			Password:    password,
// 		}
// 		sliceOfUserTableRows = append(sliceOfUserTableRows, userTableRows)
// 	}
// 	rows.Close()
// 	return sliceOfUserTableRows
// }
class User {
    constructor(id, name, surname, dni, gender, email, password, salt, penalties, role, token) {
        this.id = id
        this.name = name
        this.surname = surname
        this.dni = dni
        this.gender = gender
        this.email = email
        this.password = password
        this.salt = salt
        this.penalties = penalties
        this.role = role
        this.token = token
    }
}

class UserBuilder {
    constructor() {
        this.user = new User()
    }

    id(id) {
        this.user.id = id
        return this
    }

    name(name) {
        this.user.name = name;
        return this;
    }

    surname(surname) {
        this.user.surname = surname
        return this
    }

    dni(dni) {
        this.user.dni = dni
        return this
    }

    gender(gender) {
        this.user.gender = gender
        return this;
    }

    email(email) {
        this.user.email = email
        return this
    }

    password(password) {
        this.user.password = password
        return this
    }

    salt(salt) {
        this.user.salt = salt
        return this
    }

    penalties(penalties) {
        this.user.penalties = penalties
        return this
    }

    role(role) {
        this.user.role = role
        return this
    }

    token(token) {
        this.user.token = token
        return this
    }

    build() {
        return this.user
    }
}

module.exports = UserBuilder;


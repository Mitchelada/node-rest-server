// ===================
// Puerto
// ===================
process.env.PORT = process.env.PORT || 3000

//mongodb+srv://deeper:kcpcwqGYk6aZY3fk@cluster0-pcg5p.mongodb.net/cafe

// ===================
// Entorno
// ===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================
// Base de adtos
// ===================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe"
} else {
    urlDB = "mongodb+srv://deeper:kcpcwqGYk6aZY3fk@cluster0-pcg5p.mongodb.net/cafe"
}

process.env.NODE_ENV = urlDB
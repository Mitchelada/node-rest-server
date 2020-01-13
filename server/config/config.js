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
// Vencimiento del token
// ===================
//60 segundos
//60 minutos
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = '48h'

// ===================
// SEED de autenticacion
// ===================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'

// ===================
// Base de Datos
// ===================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://localhost:27017/cafe"
} else {
    urlDB = process.env.MONGO_URI
}

process.env.NODE_ENV = urlDB

// ===================
// Google Client ID
// ===================
process.env.CLIENT_ID = process.env.CLIENT_ID || "320053409931-k7qcm81gc78t0do1lbss2fj5vk1d9jhc.apps.googleusercontent.com"
const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

const app = express()
let Producto = require('../models/producto')


// ======================
// Obtener productos
// ======================


app.get('/productos', (req, res) => {
    //trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 0
    limite = Number(limite)

    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })


})


// ======================
// Obtener un prodcuto por ID
// ======================
app.get('/productos/:id', (req, res) => {


    let id = req.params.id
    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })


})

// ======================
// Buscar productos
// ======================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex }) //Mostrar todos
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })

        })

});







// ======================
// Obtener un prodcuto por ID
// ======================

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(402).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

})

// ======================
// Actualizar un prodcuto por ID
// ======================


app.put('/productos/:id', (req, res) => {

    let id = req.params.id
    let body = req.body

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no esta en nuestra DB'
                }
            })
        }

        productoDB.nombre = body.nombre
        productoDB.precioUni = body.precioUni
        productoDB.categoria = body.categoria
        productoDB.disponible = body.disponible
        productoDB.descripcion = body.descripcion

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
        })



    })

})

// ======================
// Borrar un producto (disponible = false)
// ======================

app.delete('/productos/:id', (req, res) => {

    let id = req.params.id
    let disponibleAct = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponibleAct, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no esta en nuestra DB'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

module.exports = app
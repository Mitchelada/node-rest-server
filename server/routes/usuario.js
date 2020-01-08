const express = require('express')

const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')

const _ = require('underscore')

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')
const app = express()

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email role estado google img') // el segundo argumento es para realizar los filtros que se necesitan
        .skip(desde) //salta los primeros 5
        .limit(limite) //muestra los 5 primeros
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })
})

app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioDB.password = null  => es para que la contraseña no se muestre en el mensaje de respuesta

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })



})

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id; //request es la peticion de parametros
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    delete body.password;
    delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {


        if (err) {
            err.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (!usuarioBorrado) {
    //         res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });

})




module.exports = app;
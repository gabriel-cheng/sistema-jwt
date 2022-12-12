const express = require("express");
const app = express();
const mongoose = require("mongoose");

function mongoConnect() {
    mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvthnwq.mongodb.net/?retryWrites=true&w=majority`
    )
        .then(() => {
            app.listen(3000, () => {
                console.log("Banco conectado com sucesso, rodando na porta 3000!");
            });
        })
        .catch(err => () => {
            console.log({dbConnectErr: err});
        });
}

module.exports = mongoConnect;

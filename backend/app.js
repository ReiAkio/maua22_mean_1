require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Cliente = require('./models/cliente');

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_CLUSTER,
  MONGODB_DATABASE
} = process.env

mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`)
.then(()=>{
  console.log("Conexão Ok")
}).catch(()=>{
  console.log("Conexão NOK")
});
app.use(bodyParser.json());

const clientes = [
]

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT,OPTIONS');
  next();
})

app.post ('/api/clientes', (req, res, next) => {
  const cliente = new Cliente({
  nome: req.body.nome,
  fone: req.body.fone,
  email: req.body.email
  })
  cliente.save().
  then (clienteInserido => {
  res.status(201).json({
  mensagem: 'Cliente inserido',
  id: clienteInserido._id
  })
  })
 });


 app.get('/api/clientes/:id', (req, res, next) => {
  Cliente.findById(req.params.id).then(cli => {
  if (cli){
  res.status(200).json(cli);
  }
  else
  res.status(404).json({mensagem: "Cliente não encontrado!"})
  })
 });
 
 app.get('/api/clientes', (req, res, next) => {
  Cliente.find().then(documents => {
    console.log(documents)
    res.status(200).json({
      mensagem: "Tudo ok",
      clientes: documents
    });
  }
  )
 });


 app.delete ('/api/clientes/:id', (req, res, next) => {
  Cliente.deleteOne ({_id: req.params.id}).then((resultado) => {
  console.log (resultado);
  res.status(200).json({mensagem: "Cliente removido"})
  });
 });

 app.use('/api/clientes', (req, res, next) => {
  res.status(200).json({
    mensagem: 'Tudo OK',
    clientes: clientes
  });
});
 

module.exports = app;

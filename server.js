const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

// ========================
// Link to Database
// ========================
MongoClient.connect('mongodb+srv://moimed:20062007@cluster0.r5hng.mongodb.net/Ifa_db?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connexion à la base de données')
    const db = client.db('top-citations')
    const quotesCollection = db.collection('quotes')

    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(quotes => {
          res.render('index.ejs', { quotes: quotes })
        })
        .catch(/* ... */)
    })

    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Alfred' },
        {
          $set: {
            name: req.body.name,
            country: req.body.country,
            theme: req.body.theme,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('Pas de ciation à supprimer')
          }
          res.json('Suppression de citation d\'Alfred de Vigny')
        })
        .catch(error => console.error(error))
    })

    // ========================
    // Listen
    // ========================    
    const port = 3000
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)

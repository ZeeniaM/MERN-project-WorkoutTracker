require('dotenv').config()
// requiring express module
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')


// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)

/**
 * Serve frontend (Vite build) in production
 * - In dev: you run Vite separately on 5173 and proxy /api to 4000
 * - In prod (Docker/K8s): backend serves frontend from ../frontend/dist
 */
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist')
  app.use(express.static(distPath))

  // Only catch non-API routes (so /api/* doesn't accidentally return index.html)
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // default to 4000 if PORT is missing
        const port = process.env.PORT || 4000
        // listening for requests
        app.listen(port, () => {
            console.log("connected to db & listening on port", port)
        })
    })
    .catch((error) => {
        console.log(error)
    })


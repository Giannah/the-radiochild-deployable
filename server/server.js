import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import SpotifyClient from './SpotifyClient.js'

const app = express()

app.set('port', process.env.PORT || 5000)

if (process.env.NODE_ENV !== 'TEST') {
  app.use(cors())
  app.use(morgan('combined'))
  app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*')
    res.header('Acces-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE')
    next()
  })
}

const API_TOKEN = process.env.API_TOKEN

function extractToken(req) {
  return req.query.token
}

const authenticatedRoute = (req, res, next) => {
  const token = extractToken(req)

  if (token) {
    if (token === API_TOKEN) {
      return next()
    } else {
      return res.status(403).json({
        success: false,
        error: 'Invalid token provided',
      })
    }
  } else {
    return res.status(403).json({
      success: false,
      error: 'No token provided. Supply token as query param `token`',
    })
  }
}

app.get('/api/check_token', (req, res) => {
  const token = extractToken(req)

  if (token) {
    if (token === API_TOKEN) {
      return res.json({ valid: true })
    } else {
      return res.json({ valid: false })
    }
  } else {
    return res.status(400).json({
      valid: false,
      error: 'No token found in `Authorization` header',
    })
  }
})

app.get('/api/albums', authenticatedRoute, (req, res) => {
  const albumIds = req.query.ids.split(',')

  SpotifyClient.getAlbums(albumIds)
    .then(albums => res.json(albums))
    .catch(error =>
      res.status(500).json({
        success: false,
        message: 'There was an error when interfacing with Spotify',
        error: error,
      }),
    )
})

const FAKE_DELAY = 500
app.post('/api/login', (req, res) => {
  setTimeout(
    () =>
      res.json({
        success: true,
        token: API_TOKEN,
      }),
    FAKE_DELAY,
  )
})

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`)
})

export default app

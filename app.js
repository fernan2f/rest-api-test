const express = require('express')
const movies = require('./movies.json')
const crypto = require('crypto')
const cors = require('cors')
const {validateMovie, validatePartialMovie} = require('./schemas/movies')
const app = express()
app.use(cors())


app.disable('x-powered-by')
app.use(express.json())

app.get('/movies', (req, res) => {
    const {genre} = req.query
    if(genre){
    const moviesFiltered = movies.filter(movie => movie.genre.some(genreItem => genreItem.toLowerCase() === genre.toLowerCase()))
    return res.json(moviesFiltered)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const {id} = req.params
    const movie = movies.find(movie => movie.id === id) 
    if (!movie) {
        res.status(404).json({message: 'Movie not found'})
    } 
    res.json(movie)
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)
    if(!result.success){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }
    const newMovie = {id:crypto.randomUUID(),...result.data}
    movies.push(newMovie)
    res.json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    const movieToModify = movies.find(movie => movie.id === req.params.id)
    if(movieToModify) {
        const result = validatePartialMovie(req.body)
        if(!result.success){  
            return res.status(400).json({message: JSON.parse(result.error.message)})
        } 
        Object.assign(movieToModify,result.data)
        return res.json(movieToModify)
    }
    
    res.status(404).json({success:false, message: 'Movie not found'})
})

const desiredPort = process.env.PORT ?? 3000

app.listen(desiredPort, () => {
    console.log(`Server running on port http://localhost:${desiredPort}/ `)
    
})
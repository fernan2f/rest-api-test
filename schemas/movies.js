import z from 'zod'

const movieSchema = z.object({
    title: z.string().min(1).max(300),
    year: z.number().int().min(1888).max(2023),
    director: z.string().min(1).max(100),
    duration: z.number().int().min(1).max(500),
    poster: z.string().url(),
    genre: z.array(z.enum(['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'])),
    rate : z.number().min(0).max(10).optional()
})

export function validateMovie(object){
    return movieSchema.safeParse(object)
}

export function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object)
}

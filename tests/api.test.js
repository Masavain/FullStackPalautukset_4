const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

describe('initial blogs', async () => {
    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = initialBlogs.map(b => new Blog(b))
        await Promise.all(blogObjects.map(b => b.save()))
    })

    test('all blogs are returned as json by GET /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(blogsInDatabase.length)

        const returnedTitles = response.body.map(p => p.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedTitles).toContain(blog.title)
        })
    })

    test('individual blog is returned as json by GET /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()
        const aBlog = blogsInDatabase[0]

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)


        const returnedTitles = response.body.map(r => r.title)

        expect(returnedTitles).toContain(aBlog.title)
    })

    describe('addition of a new blog', async () => {

        test('POST /api/blogs succeeds with valid data', async () => {
            const blogsAtStart = await blogsInDb()

            const newBlog = {
                title: 'masan musablogi',
                author: 'Matti',
                url: 'asdasd.com',
                likes: 0
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAfterOperation = await blogsInDb()

            expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

            const titles = blogsAfterOperation.map(r => r.title)
            expect(titles).toContain('masan musablogi')
        })

        test('no likes is valid and can be added by POST /api/blogs', async () => {
            const blogsAtStart = await blogsInDb()

            const newBlog = {
                title: 'masan musablogi',
                author: 'Matti',
                url: 'asdasd.com',
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAfterOperation = await blogsInDb()
            expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

            const titles = blogsAfterOperation.map(r => r.title)

            expect(titles).toContain('masan musablogi')
        })

        test('blog without title or url fails by POST /api/blogs and proper statuscode', async () => {
            const blogsAtStart = await blogsInDb()

            const newBlog = {
                author: 'Matti',
                url: 'asdasd.com',
                likes: 0
            }

            const newBlog2 = {
                title: 'masan matikkablogi',
                author: 'Matti',
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)

            await api
                .post('/api/blogs')
                .send(newBlog2)
                .expect(400)

            const blogsAfterOperation = await blogsInDb()
            expect(blogsAfterOperation.length).toBe(blogsAtStart.length)

            const titles = blogsAfterOperation.map(r => r.title)
            expect(titles).not.toContain('masan matikkablogi')
        })

    })


})







afterAll(() => {
    server.close()
})
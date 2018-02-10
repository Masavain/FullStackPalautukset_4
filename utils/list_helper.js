const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 0 ? 0: blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (prev, cur) => {
        return (prev.likes > cur.likes) ? prev : cur
    }
    return blogs.reduce(reducer,0)
    

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
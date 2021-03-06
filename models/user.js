const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  adult: Boolean,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = (user) => {
  return {
    username: user.username,
    name: user.name,
    id: user.id,
    adult: user.adult,
    blogs: user.blogs
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
const userResolver = require('./user')
const messageResolver = require('./message')

module.exports = {
  Message:{
    createdAt: (parent) => parent.createdAt.toISOString()
  },
  Query:{
    ...userResolver.Query,
    ...messageResolver.Query,
  },
  Mutation:{
    ...userResolver.Mutation,
    ...messageResolver.Mutation,
  },
}
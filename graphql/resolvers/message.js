const { User, Message } = require('../../models');
const { UserInputError, AuthenticationError } = require('apollo-server')
const { Op } = require('sequelize')

module.exports = {
  Query:{
    getMessages: async (parent, { from }, { user }) =>{
      try {
        if(!user) throw new AuthenticationError('Unauthorize')
        const fromUser = await User.findOne({where: { username: from}})
        if(!fromUser) throw new UserInputError('user not found')
        const usernames = [user.username, fromUser.username]
        const messages = await Message.findAll({
          where: {
            from:{[Op.in]: usernames},
            to:{[Op.in]: usernames},
          },
          order:[['createdAt', 'DESC']]
        })

        return messages
      } catch (err) {
        console.log(err)
        throw err
      }
    }
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if(!user) throw new AuthenticationError('Unauthorize')
        const toUser = await User.findOne({ where: {username: to}})

        if(!toUser) throw new UserInputError('User not found')
        else if(toUser.username === user.username) throw new UserInputError('You can not message yourself..!')

        if(content.trim() === '') throw new UserInputError('message can not be empty')

        const newMessage = await Message.create({
          from: user.username,
          to,
          content
        })

        return newMessage
      } catch (err) {
        console.log(err)
        throw err
      }
    }
  }
};
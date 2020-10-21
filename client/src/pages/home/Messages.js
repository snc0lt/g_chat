import React, { Fragment, useEffect, useState } from 'react'
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Button, Col, Form } from "react-bootstrap";
import { useMessageDispatch, useMessageState } from '../../context/message';
import Message from './Message';


const GET_MESSAGES = gql`
  query getMessages($from: String!){
    getMessages(from: $from){
      uuid from to content createdAt
  }
}
`
const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid from to content createdAt
    }
  }
`
const Messages = () => {
  const { users } = useMessageState()
  const dispatch = useMessageDispatch()
  const [content, setContent] = useState('')

  const selectedUser = users?.find((u) => u.selected === true)
  const messages = selectedUser?.messages

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES)

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: data => dispatch({type: 'ADD_MESSAGE', payload: {username: selectedUser.username, message: data.sendMessage}}),
    onError: (err) => console.log(err),
  })

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } })
    }
  }, [selectedUser])

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_USER_MESSAGES',
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      })
    }
  }, [messagesData, dispatch])

  const submitMessage = (e) => {
    e.preventDefault()

    if (content.trim() === '' || !selectedUser) return

    setContent('')

    // mutation for sending the message
    sendMessage({ variables: { to: selectedUser.username, content } })
  }

  let chatMarkup
  if (!messages && !messagesLoading) {
    chatMarkup = <p className="info-text">Select a friend</p>
  } else if (messagesLoading) {
    chatMarkup = <p className="info-text">Loading..</p>
  } else if (messages.length > 0) {
    chatMarkup = messages.map((message, index) => (
      <Fragment key={message.uuid}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ))
  } else if (messages.length === 0) {
    chatMarkup = (
      <p className="info-text">
        You are now connected! send your first message!
      </p>
    )
  }

  return (
    <Col xs={8}>
      <div className='messages_box d-flex flex-column-reverse'>
        {chatMarkup}
      </div>
      <div className='d-flex input_form'>
        <Form className='msg_form' onSubmit={submitMessage}>
          <Form.Group>
            <Form.Control type='text' className='rounded-pill bg-secondary msg-input'
              placeholder='something to say..?' value={content} onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Button className='mb-3 border-0' variant='light' onClick={submitMessage}>SEND</Button>
      </div>
    </Col>
  )
}


export default Messages

import React, { Fragment } from 'react'
import { useAuthState } from "../../context/auth";

const Message = ({ message }) => {
  const { user } = useAuthState()
  const sent = message.from === user.username

  return (
    <Fragment className='d-flex'>
      <div className={sent ? 'd-flex my-3 ml-auto' : 'd-flex my-3'}>
        <div className={sent ? 'py-2 px-3 rounded-pill bg-primary' : 'py-2 px-3 rounded-pill bg-dark'}>
          <p className='text-white'>{message.content}</p>
        </div>
      </div>
      <div className={sent ? 'ml-auto mt-2 ml-2 date_text' : 'mt-2 ml-2 date_text'}>
        <small>
          {message.createdAt.split('T')[0].substring(0, 10)}{message.createdAt.split('T')[1].substring(0, 5)}
        </small>
      </div>
    </Fragment>
  )
}

export default Message

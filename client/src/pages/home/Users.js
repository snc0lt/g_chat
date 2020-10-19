import React from 'react'
import { Col, Image } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { useMessageDispatch, useMessageState } from "../../context/message";


const GET_USERS = gql`
  query getUsers{
    getUsers{
    username imageURL createdAt latestMessage{
      uuid createdAt from to content
    }
  }
  }
`

const Users = () => {
  const dispatch = useMessageDispatch()
  const { users } = useMessageState()
  const selectedUser = users?.find( u => u.selected === true)?.username

  const { loading } = useQuery(GET_USERS, {
    onCompleted: data => dispatch({ type: 'SET_USERS', paylaod: data.getUsers }),
    onError: err => console.log(err)
  })

  let userMarkup
  if (!users || loading) {
    userMarkup = <p>Loading...</p>
  }
  else if (users.length === 0) {
    userMarkup = <p>no user yet..!</p>
  }
  else if (users.length > 0) {
    userMarkup = users.map((u, i) => (
      <div className={selectedUser === u.username ? 'user-div d-flex py-3 px-2 bg-white' : 'user-div d-flex py-3 px2'}
        key={i} onClick={() => dispatch({type: 'SET_SELECTED_USER', payload: u.username})}
        style={{ cursor: 'pointer', borderBottom: '1px solid #b5b5b5' }}>
        <Image src={u.imageURL || 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'} className='mr-2' roundedCircle style={{ with: 45, height: 45, objectFit: 'cover' }} />
        <div>
          <p className='text-success'>{u.username}</p>
          <p className='font-weight-light'>{u.latestMessage ? u.latestMessage.content : 'you are now connected..!'}</p>
        </div>
      </div>
    ))
  }
  
  return (
    <Col xs={4} className='bg-secondary p-0'>
      {userMarkup}
    </Col>
  )
}

export default Users

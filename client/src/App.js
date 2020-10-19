import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import ApolloProvider from './ApolloProvider'
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import './App.scss';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/home/Home';

function App() {

  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <Router>
            <Container className="pt-5">
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/login' component={Login} />
              </Switch>
            </Container>
          </Router>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

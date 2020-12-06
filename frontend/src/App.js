import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardScreen from './screens/DashboardScreen';
import BugScreen from './screens/BugScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/bug/:id" component={BugScreen} />
          <Route path="/" component={DashboardScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import CardList from './pages/CardsList';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <Route path="/card" element={<Dashboard grid={0} />} /> */}
          <Route path="/" element={<CardList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../src/pages/index';
import Favorites from '../src/pages/favorites/index';

function App() {
  
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/favorites" element={<Favorites/>} />
          </Routes>
      </Router>
  )
}

export default App

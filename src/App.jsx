import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FullMap from './FullMap';
import HomePage from './HomePage';
import './CSS/style.css';

function App() {
  return (
    <div className="Content">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<FullMap />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
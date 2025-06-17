import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CurrentStatePage } from './pages/CurrentStatePage.tsx';
import { NavBar } from './components/NavBar';
import { AlertsPage } from './pages/AlertsPage.tsx';

const App = () => {
  return (
    <Router>
      <NavBar />
      <main className="px-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/state" element={<CurrentStatePage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

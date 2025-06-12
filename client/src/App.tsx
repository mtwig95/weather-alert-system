import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Alerts } from './pages/Alerts';
import { CurrentState } from './pages/CurrentState';
import { NavBar } from './components/NavBar';

const App = () => {
    return (
        <Router>
            <NavBar />
            <main className="max-w-4xl mx-auto px-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/state" element={<CurrentState />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;

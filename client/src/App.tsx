import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CurrentState } from './pages/CurrentState';
import { NavBar } from './components/NavBar';
import {AlertsPage} from "./pages/AlertsPage.tsx";

const App = () => {
    return (
        <Router>
            <NavBar />
            <main className="max-w-4xl mx-auto px-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/alerts" element={<AlertsPage />} />
                    <Route path="/state" element={<CurrentState />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;

import { NavLink } from 'react-router-dom';

export const NavBar = () => {
    return (
    <header className="bg-[#1A2233] text-white shadow-sm">
      <nav className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center font-sans">
        <div className="text-lg font-bold tracking-wide">🌩️ Weather Alerts</div>

        <div className="flex gap-4 text-sm font-medium">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
              isActive
                ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5'
                : 'text-gray-300 hover:text-white transition'
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/alerts"
                    className={({ isActive }) =>
              isActive
                ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5'
                : 'text-gray-300 hover:text-white transition'
                    }
                >
                    Alerts
                </NavLink>
                <NavLink
                    to="/state"
                    className={({ isActive }) =>
              isActive
                ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5'
                : 'text-gray-300 hover:text-white transition'
                    }
                >
                    Current State
                </NavLink>
            </div>
        </nav>
    </header>
    );
};

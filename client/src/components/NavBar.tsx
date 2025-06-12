import { NavLink } from 'react-router-dom';

export const NavBar = () => {
    const baseStyle =
        'px-4 py-2 rounded-xl transition-colors duration-200 text-sm sm:text-base';
    const activeStyle = 'bg-blue-500 text-white shadow-md font-semibold';
    const inactiveStyle = 'text-gray-700 hover:bg-blue-100';

    return (
        <nav className="bg-white shadow-md mb-6">
            <div className="max-w-4xl mx-auto px-4 py-3 flex gap-3 sm:gap-6">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/alerts"
                    className={({ isActive }) =>
                        `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
                    }
                >
                    Alerts
                </NavLink>
                <NavLink
                    to="/state"
                    className={({ isActive }) =>
                        `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
                    }
                >
                    Current State
                </NavLink>
            </div>
        </nav>
    );
};

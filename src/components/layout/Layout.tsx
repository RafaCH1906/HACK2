import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊', emoji: true },
        { name: 'Proyectos', path: '/projects', icon: '📁', emoji: true },
        { name: 'Tareas', path: '/tasks', icon: '✅', emoji: true },
        { name: 'Equipo', path: '/team', icon: '👥', emoji: true },
    ];

    const isActive = (path: string) => location.pathname === path;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg shadow-sm fixed top-0 left-0 right-0 z-20 border-b border-gray-200/50">
                <div className="flex justify-between items-center px-6 py-3">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white font-bold text-lg">T</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent hidden sm:block">
                            TechFlow
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                                {getInitials(user?.name || 'U')}
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Salir</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex pt-14">
                {/* Sidebar */}
                <aside className="w-64 fixed left-0 top-14 bottom-0 hidden md:block p-4">
                    <nav className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-gray-200/50 p-4 h-full border border-gray-200/50">
                        <ul className="space-y-2">
                            {navigation.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl 
                      transition-all duration-200
                      ${isActive(item.path)
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }
                    `}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Version badge */}
                        <div className="absolute bottom-6 left-4 right-4">
                            <div className="px-4 py-2 bg-gray-50 rounded-xl text-center">
                                <p className="text-xs text-gray-500">TechFlow v1.0</p>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Mobile Navigation */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200/50 shadow-lg z-20">
                    <nav className="flex justify-around py-2 px-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex flex-col items-center p-2 rounded-xl transition-all duration-200
                  ${isActive(item.path)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }
                `}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-xs mt-1 font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-6 pb-24 md:pb-6">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
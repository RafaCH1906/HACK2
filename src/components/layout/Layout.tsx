import { type ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const navigation = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊', emoji: true },
        { name: 'Proyectos', path: '/projects', icon: '📁', emoji: true },
        { name: 'Tareas', path: '/tasks', icon: '✅', emoji: true },
        { name: 'Equipo', path: '/team', icon: '👥', emoji: true },
    ];

    const isActive = (path: string) => location.pathname === path;

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

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

                    <div className="flex items-center gap-3">
                        {/* Profile Section - Clickable with dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 cursor-pointer"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white">
                                    {getInitials(user?.name || 'U')}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="font-semibold text-gray-900 text-sm leading-tight">{user?.name}</p>
                                    <p className="text-xs text-gray-600">{user?.email}</p>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                                    {/* User Info Header */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="font-semibold text-gray-900">{user?.name}</p>
                                        <p className="text-sm text-gray-600">{user?.email}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-gray-700">Mi Perfil</span>
                                        </Link>

                                        <div className="border-t border-gray-100 my-2"></div>

                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                logout();
                                            }}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="text-red-600 font-medium">Cerrar Sesión</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
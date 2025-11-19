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
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Proyectos', path: '/projects', icon: '📁' },
        { name: 'Tareas', path: '/tasks', icon: '✅' },
        { name: 'Equipo', path: '/team', icon: '👥' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
                <div className="flex justify-between items-center px-6 py-4">
                    <Link to="/dashboard" className="text-2xl font-bold text-gray-900">
                        🚀 TechFlow
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="font-medium text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                        <Button variant="secondary" size="sm" onClick={logout}>
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex pt-16">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md fixed left-0 top-16 bottom-0 hidden md:block">
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {navigation.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Mobile Navigation */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10">
                    <nav className="flex justify-around py-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center p-2 ${isActive(item.path)
                                    ? 'text-blue-600'
                                    : 'text-gray-600'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-xs mt-1">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-6 pb-20 md:pb-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
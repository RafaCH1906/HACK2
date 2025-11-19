import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Ilustración de error 404 */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 mb-6">
                        <svg
                            className="w-16 h-16 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    {/* Código de error */}
                    <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>

                    {/* Mensaje principal */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Página no encontrada
                    </h2>

                    {/* Descripción */}
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                        Lo sentimos, la página que estás buscando no existe o ha sido movida.
                    </p>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/dashboard">
                        <Button size="lg" className="min-w-[200px]">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Ir al Dashboard
                        </Button>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="min-w-[200px] px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Volver atrás
                    </button>
                </div>

                {/* Enlaces útiles */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Enlaces útiles:</p>
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        <Link to="/projects" className="text-blue-600 hover:text-blue-700 hover:underline">
                            Proyectos
                        </Link>
                        <Link to="/tasks" className="text-blue-600 hover:text-blue-700 hover:underline">
                            Tareas
                        </Link>
                        <Link to="/team" className="text-blue-600 hover:text-blue-700 hover:underline">
                            Equipo
                        </Link>
                        <Link to="/profile" className="text-blue-600 hover:text-blue-700 hover:underline">
                            Perfil
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

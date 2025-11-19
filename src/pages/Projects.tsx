import { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import type { Project, ProjectStatus } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Form states
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formStatus, setFormStatus] = useState<ProjectStatus>('ACTIVE');
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        loadProjects();
    }, [currentPage, search]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const response = await projectsAPI.getAll(currentPage, 10, search);
            setProjects(response.projects);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error('Error cargando proyectos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async () => {
        if (!formName.trim()) {
            setFormError('El nombre es obligatorio');
            return;
        }

        setFormLoading(true);
        setFormError('');

        try {
            if (editingProject) {
                await projectsAPI.update(editingProject.id, {
                    name: formName.trim(),
                    description: formDescription.trim(),
                    status: formStatus,
                });
            } else {
                await projectsAPI.create({
                    name: formName.trim(),
                    description: formDescription.trim(),
                    status: formStatus,
                });
            }

            await loadProjects();
            closeModal();
        } catch (err) {
            console.error('Error guardando proyecto:', err);
            setFormError('Error al guardar el proyecto');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto?')) {
            return;
        }

        try {
            await projectsAPI.delete(id);
            await loadProjects();
        } catch (err) {
            console.error('Error eliminando proyecto:', err);
            alert('Error al eliminar el proyecto');
        }
    };

    const handleViewDetails = async (project: Project) => {
        try {
            const details = await projectsAPI.getById(project.id);
            setSelectedProject(details);
            setShowDetailModal(true);
        } catch (err) {
            console.error('Error cargando detalles:', err);
        }
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setFormName('');
        setFormDescription('');
        setFormStatus('ACTIVE');
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (project: Project) => {
        setEditingProject(project);
        setFormName(project.name);
        setFormDescription(project.description);
        setFormStatus(project.status);
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProject(null);
    };

    const getStatusColor = (status: ProjectStatus) => {
        const colors = {
            ACTIVE: 'bg-green-100 text-green-800',
            COMPLETED: 'bg-blue-100 text-blue-800',
            ON_HOLD: 'bg-yellow-100 text-yellow-800',
        };
        return colors[status];
    };

    const getStatusLabel = (status: ProjectStatus) => {
        const labels = {
            ACTIVE: 'Activo',
            COMPLETED: 'Completado',
            ON_HOLD: 'En Pausa',
        };
        return labels[status];
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
                    <p className="text-gray-600">Gestiona tus proyectos</p>
                </div>
                <Button onClick={openCreateModal}>+ Nuevo Proyecto</Button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="Buscar proyectos..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="max-w-md"
                />
            </div>

            {/* Projects List */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : projects.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-gray-500 mb-4">No hay proyectos</p>
                    <Button onClick={openCreateModal}>Crear primer proyecto</Button>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {projects.map((project) => (
                            <Card key={project.id} hover onClick={() => handleViewDetails(project)}>
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                                        {project.name}
                                    </h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                                        {getStatusLabel(project.status)}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {project.description || 'Sin descripción'}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(project);
                                        }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(project.id);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <span className="px-4 py-2">
                                Página {currentPage} de {totalPages}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            >
                <div className="space-y-4">
                    <Input
                        label="Nombre del proyecto"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ej: Proyecto Alpha"
                        required
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Describe el proyecto..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    <Select
                        label="Estado"
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as ProjectStatus)}
                        options={[
                            { value: 'ACTIVE', label: 'Activo' },
                            { value: 'COMPLETED', label: 'Completado' },
                            { value: 'ON_HOLD', label: 'En Pausa' },
                        ]}
                    />

                    {formError && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {formError}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button onClick={handleCreateOrUpdate} isLoading={formLoading} className="flex-1">
                            {editingProject ? 'Actualizar' : 'Crear'}
                        </Button>
                        <Button variant="secondary" onClick={closeModal} className="flex-1">
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={selectedProject?.name || 'Detalles del Proyecto'}
                size="lg"
            >
                {selectedProject && (
                    <div>
                        <div className="mb-4">
                            <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                                {getStatusLabel(selectedProject.status)}
                            </span>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-1">Descripción</h4>
                            <p className="text-gray-600">
                                {selectedProject.description || 'Sin descripción'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-1">Creado</h4>
                            <p className="text-gray-600">
                                {new Date(selectedProject.createdAt).toLocaleDateString('es-PE', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        {selectedProject.tasks && selectedProject.tasks.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">
                                    Tareas ({selectedProject.tasks.length})
                                </h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedProject.tasks.map((task) => (
                                        <div key={task.id} className="p-2 bg-gray-50 rounded text-sm">
                                            <span className="font-medium">{task.title}</span>
                                            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Projects;
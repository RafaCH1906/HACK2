import { useState, useEffect } from 'react';
import { tasksAPI, projectsAPI, teamAPI } from '../services/api';
import type { Task, Project, TeamMember, TaskStatus, TaskPriority } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<string>('');
    const [filterProject, setFilterProject] = useState<string>('');
    const [filterAssignee, setFilterAssignee] = useState<string>('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Form states
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formProjectId, setFormProjectId] = useState('');
    const [formPriority, setFormPriority] = useState<TaskPriority>('MEDIUM');
    const [formStatus, setFormStatus] = useState<TaskStatus>('TODO');
    const [formDueDate, setFormDueDate] = useState('');
    const [formAssignedTo, setFormAssignedTo] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        loadTasks();
    }, [currentPage, filterStatus, filterPriority, filterProject, filterAssignee]);

    const loadInitialData = async () => {
        try {
            const [projectsResponse, teamResponse] = await Promise.all([
                projectsAPI.getAll(1, 100),
                teamAPI.getMembers(),
            ]);
            console.log('Proyectos cargados:', projectsResponse.projects);
            console.log('Miembros del equipo cargados:', teamResponse.members);
            setProjects(projectsResponse.projects);
            setTeamMembers(teamResponse.members);
        } catch (err) {
            console.error('Error cargando datos iniciales:', err);
        }
    };

    const loadTasks = async () => {
        setLoading(true);
        try {
            const response = await tasksAPI.getAll({
                page: currentPage,
                limit: 20,
                status: filterStatus as TaskStatus || undefined,
                priority: filterPriority as TaskPriority || undefined,
                projectId: filterProject || undefined,
                assignedTo: filterAssignee || undefined,
            });
            setTasks(response.tasks);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error('Error cargando tareas:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async () => {
        if (!formTitle.trim()) {
            setFormError('El título es obligatorio');
            return;
        }
        if (!formProjectId) {
            setFormError('Selecciona un proyecto');
            return;
        }
        if (!formDueDate) {
            setFormError('La fecha límite es obligatoria');
            return;
        }

        setFormLoading(true);
        setFormError('');

        try {
            // Convertir la fecha a formato ISO completo
            const dueDateISO = new Date(formDueDate + 'T23:59:59.999Z').toISOString();

            const taskData = {
                title: formTitle.trim(),
                description: formDescription.trim(),
                priority: formPriority,
                dueDate: dueDateISO,
                ...(formAssignedTo && { assignedTo: formAssignedTo }),
            };

            if (editingTask) {
                const updateData = { ...taskData, status: formStatus };
                console.log('Actualizando tarea con datos:', updateData);
                await tasksAPI.update(editingTask.id, updateData);
            } else {
                const createData = {
                    title: taskData.title,
                    description: taskData.description,
                    priority: taskData.priority,
                    due_date: taskData.dueDate,
                    project_id: String(formProjectId),
                    ...(formAssignedTo && { assigned_to: formAssignedTo }),
                };
                console.log('Creando tarea con datos:', createData);
                await tasksAPI.create(createData as any);
            }

            await loadTasks();
            closeModal();
        } catch (err: any) {
            console.error('Error guardando tarea:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            console.error('Error response detail:', err.response?.data?.detail);

            let errorMessage = 'Error al guardar la tarea';

            // Si hay un array de detalles de validación
            if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
                const details = err.response.data.detail.map((d: any) => {
                    if (typeof d === 'string') return d;
                    return `${d.loc?.join('.')} - ${d.msg}`;
                }).join(', ');
                errorMessage = `Errores de validación: ${details}`;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setFormError(errorMessage);
        } finally {
            setFormLoading(false);
        }
    };

    const handleStatusChange = async (taskId: string, status: TaskStatus) => {
        try {
            await tasksAPI.updateStatus(taskId, status);
            await loadTasks();
        } catch (err) {
            console.error('Error actualizando estado:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) {
            return;
        }

        try {
            await tasksAPI.delete(id);
            await loadTasks();
        } catch (err) {
            console.error('Error eliminando tarea:', err);
            alert('Error al eliminar la tarea');
        }
    };

    const openCreateModal = () => {
        if (projects.length === 0) {
            alert('Primero debes crear un proyecto antes de poder crear tareas');
            return;
        }

        setEditingTask(null);
        setFormTitle('');
        setFormDescription('');
        setFormProjectId(projects[0]?.id || '');
        setFormPriority('MEDIUM');
        setFormStatus('TODO');
        setFormDueDate(new Date().toISOString().split('T')[0]);
        setFormAssignedTo('');
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setFormTitle(task.title);
        setFormDescription(task.description);
        setFormProjectId(task.projectId);
        setFormPriority(task.priority);
        setFormStatus(task.status);
        setFormDueDate(task.dueDate.split('T')[0]);
        setFormAssignedTo(task.assignedTo || '');
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTask(null);
    };

    const clearFilters = () => {
        setFilterStatus('');
        setFilterPriority('');
        setFilterProject('');
        setFilterAssignee('');
        setCurrentPage(1);
    };

    const getPriorityColor = (priority: TaskPriority) => {
        const colors = {
            LOW: 'bg-gray-100 text-gray-800',
            MEDIUM: 'bg-blue-100 text-blue-800',
            HIGH: 'bg-orange-100 text-orange-800',
            URGENT: 'bg-red-100 text-red-800',
        };
        return colors[priority];
    };

    const getStatusColor = (status: TaskStatus) => {
        const colors = {
            TODO: 'bg-gray-100 text-gray-800',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
            COMPLETED: 'bg-green-100 text-green-800',
        };
        return colors[status];
    };

    const isOverdue = (dueDate: string, status: TaskStatus) => {
        return new Date(dueDate) < new Date() && status !== 'COMPLETED';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tareas</h1>
                    <p className="text-gray-600">Gestiona tus tareas</p>
                </div>
                <Button onClick={openCreateModal}>+ Nueva Tarea</Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <h3 className="font-semibold mb-4">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Select
                        label="Estado"
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        options={[
                            { value: '', label: 'Todos' },
                            { value: 'TODO', label: 'Por hacer' },
                            { value: 'IN_PROGRESS', label: 'En progreso' },
                            { value: 'COMPLETED', label: 'Completado' },
                        ]}
                    />

                    <Select
                        label="Prioridad"
                        value={filterPriority}
                        onChange={(e) => {
                            setFilterPriority(e.target.value);
                            setCurrentPage(1);
                        }}
                        options={[
                            { value: '', label: 'Todas' },
                            { value: 'LOW', label: 'Baja' },
                            { value: 'MEDIUM', label: 'Media' },
                            { value: 'HIGH', label: 'Alta' },
                            { value: 'URGENT', label: 'Urgente' },
                        ]}
                    />

                    <Select
                        label="Proyecto"
                        value={filterProject}
                        onChange={(e) => {
                            setFilterProject(e.target.value);
                            setCurrentPage(1);
                        }}
                        options={[
                            { value: '', label: 'Todos' },
                            ...projects.map(p => ({ value: p.id, label: p.name })),
                        ]}
                    />

                    <Select
                        label="Asignado a"
                        value={filterAssignee}
                        onChange={(e) => {
                            setFilterAssignee(e.target.value);
                            setCurrentPage(1);
                        }}
                        options={[
                            { value: '', label: 'Todos' },
                            ...teamMembers.map(m => ({ value: m.id, label: m.name })),
                        ]}
                    />

                    <div className="flex items-end">
                        <Button variant="secondary" onClick={clearFilters} size="sm">
                            Limpiar filtros
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Tasks List */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : tasks.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-gray-500 mb-4">No hay tareas</p>
                    <Button onClick={openCreateModal}>Crear primera tarea</Button>
                </Card>
            ) : (
                <>
                    <div className="space-y-3 mb-6">
                        {tasks.map((task) => (
                            <Card key={task.id} className={isOverdue(task.dueDate, task.status) ? 'border-l-4 border-red-500' : ''}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                            {isOverdue(task.dueDate, task.status) && (
                                                <span className="text-xs text-red-600 font-medium">⚠️ Vencida</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                        <div className="flex flex-wrap gap-2 text-sm">
                                            <span className="text-gray-500">
                                                📅 {new Date(task.dueDate).toLocaleDateString('es-PE')}
                                            </span>
                                            {task.assignedUser && (
                                                <span className="text-gray-500">
                                                    👤 {task.assignedUser.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                                                className="text-xs px-2 py-1 border rounded"
                                            >
                                                <option value="TODO">Por hacer</option>
                                                <option value="IN_PROGRESS">En progreso</option>
                                                <option value="COMPLETED">Completado</option>
                                            </select>
                                            <Button size="sm" variant="secondary" onClick={() => openEditModal(task)}>
                                                Editar
                                            </Button>
                                            <Button size="sm" variant="danger" onClick={() => handleDelete(task.id)}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
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
                title={editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
                size="lg"
            >
                <div className="space-y-4">
                    <Input
                        label="Título"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ej: Implementar login"
                        required
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Describe la tarea..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Proyecto"
                            value={formProjectId}
                            onChange={(e) => setFormProjectId(e.target.value)}
                            options={projects.map(p => ({ value: p.id, label: p.name }))}
                            disabled={!!editingTask}
                        />

                        <Input
                            type="date"
                            label="Fecha límite"
                            value={formDueDate}
                            onChange={(e) => setFormDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Prioridad"
                            value={formPriority}
                            onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                            options={[
                                { value: 'LOW', label: 'Baja' },
                                { value: 'MEDIUM', label: 'Media' },
                                { value: 'HIGH', label: 'Alta' },
                                { value: 'URGENT', label: 'Urgente' },
                            ]}
                        />

                        {editingTask && (
                            <Select
                                label="Estado"
                                value={formStatus}
                                onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                                options={[
                                    { value: 'TODO', label: 'Por hacer' },
                                    { value: 'IN_PROGRESS', label: 'En progreso' },
                                    { value: 'COMPLETED', label: 'Completado' },
                                ]}
                            />
                        )}
                    </div>

                    <Select
                        label="Asignar a (opcional)"
                        value={formAssignedTo}
                        onChange={(e) => setFormAssignedTo(e.target.value)}
                        options={[
                            { value: '', label: 'Sin asignar' },
                            ...teamMembers.map(m => ({ value: m.id, label: m.name })),
                        ]}
                    />

                    {formError && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {formError}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button onClick={handleCreateOrUpdate} isLoading={formLoading} className="flex-1">
                            {editingTask ? 'Actualizar' : 'Crear'}
                        </Button>
                        <Button variant="secondary" onClick={closeModal} className="flex-1">
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Tasks;
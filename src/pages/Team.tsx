import { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';
import type { TeamMember, Task } from '../types';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';

const Team = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [memberTasks, setMemberTasks] = useState<Task[]>([]);
    const [showTasksModal, setShowTasksModal] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(false);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Sin fecha';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            return date.toLocaleDateString('es-PE');
        } catch {
            return 'Fecha inválida';
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const response = await teamAPI.getMembers();
            setMembers(response.members);
        } catch (err) {
            console.error('Error cargando miembros:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewTasks = async (member: TeamMember) => {
        setSelectedMember(member);
        setLoadingTasks(true);
        setShowTasksModal(true);

        try {
            const response = await teamAPI.getMemberTasks(member.id);
            setMemberTasks(response.tasks);
        } catch (err) {
            console.error('Error cargando tareas del miembro:', err);
            setMemberTasks([]);
        } finally {
            setLoadingTasks(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            TODO: 'bg-gray-100 text-gray-800',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
            COMPLETED: 'bg-green-100 text-green-800',
        };
        return colors[status as keyof typeof colors] || colors.TODO;
    };

    const getPriorityColor = (priority: string) => {
        const colors = {
            LOW: 'bg-gray-100 text-gray-800',
            MEDIUM: 'bg-blue-100 text-blue-800',
            HIGH: 'bg-orange-100 text-orange-800',
            URGENT: 'bg-red-100 text-red-800',
        };
        return colors[priority as keyof typeof colors] || colors.LOW;
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getAvatarColor = (index: number) => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-teal-500',
            'bg-orange-500',
            'bg-red-500',
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Equipo</h1>
                <p className="text-gray-600">Miembros del equipo y sus tareas asignadas</p>
            </div>

            {members.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-gray-500">No hay miembros en el equipo</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member, index) => (
                        <Card key={member.id} hover onClick={() => handleViewTasks(member)}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(index)}`}>
                                    {getInitials(member.name)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                    <p className="text-sm text-gray-600">{member.email}</p>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-blue-600">
                                Ver tareas asignadas →
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Tasks Modal */}
            <Modal
                isOpen={showTasksModal}
                onClose={() => setShowTasksModal(false)}
                title={`Tareas de ${selectedMember?.name}`}
                size="lg"
            >
                {loadingTasks ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : memberTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        No hay tareas asignadas a este miembro
                    </p>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {memberTasks.map((task) => (
                            <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                                    <div className="flex gap-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                <p className="text-xs text-gray-500">
                                    Vence: {formatDate(task.dueDate)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Team;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI, projectsAPI } from '../services/api';
import type { Task, Project } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [tasksResponse, projectsResponse] = await Promise.all([
        tasksAPI.getAll({ limit: 100 }),
        projectsAPI.getAll(1, 100),
      ]);
      setTasks(tasksResponse.tasks);
      setProjects(projectsResponse.projects);
    } catch (err) {
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingTasks = tasks.filter(t => t.status === 'TODO').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const overdueTasks = tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate < new Date() && t.status !== 'COMPLETED';
    }).length;
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      totalProjects,
      activeProjects,
    };
  };

  const stats = getStats();

  const getRecentTasks = () => {
    return tasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
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

  const getStatusColor = (status: string) => {
    const colors = {
      TODO: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
    };
    return colors[status as keyof typeof colors] || colors.TODO;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu actividad</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h3 className="text-lg font-medium mb-1">Total Tareas</h3>
          <p className="text-4xl font-bold">{stats.totalTasks}</p>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <h3 className="text-lg font-medium mb-1">Completadas</h3>
          <p className="text-4xl font-bold">{stats.completedTasks}</p>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <h3 className="text-lg font-medium mb-1">En Progreso</h3>
          <p className="text-4xl font-bold">{stats.inProgressTasks}</p>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <h3 className="text-lg font-medium mb-1">Vencidas</h3>
          <p className="text-4xl font-bold">{stats.overdueTasks}</p>
        </Card>
      </div>

      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/tasks">
              <Button>+ Nueva Tarea</Button>
            </Link>
            <Link to="/projects">
              <Button variant="secondary">Ver Proyectos</Button>
            </Link>
            <Link to="/team">
              <Button variant="secondary">Ver Equipo</Button>
            </Link>
          </div>
        </Card>

        {/* Project Stats */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Proyectos</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{stats.totalProjects}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{stats.activeProjects}</p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-600">
                {stats.totalProjects - stats.activeProjects}
              </p>
              <p className="text-sm text-gray-600">Completados/Pausados</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Tareas Recientes</h3>
          <Link to="/tasks" className="text-blue-600 hover:underline text-sm">
            Ver todas →
          </Link>
        </div>

        {getRecentTasks().length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay tareas aún</p>
        ) : (
          <div className="space-y-3">
            {getRecentTasks().map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600">
                    Vence: {new Date(task.dueDate).toLocaleDateString('es-PE')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
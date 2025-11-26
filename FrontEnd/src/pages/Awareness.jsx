// pages/Awareness.jsx - UPDATED VERSION WITH MODULE CREATION
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCheckCircle, faClock, faUsers, faChartLine, faSearch, faPlus, faCertificate, faTimes } from '@fortawesome/free-solid-svg-icons';
import Card from '../components/Card';
import CardSlider from '../components/CardSlider';
import { useUser } from '../hooks/useUser';
import { awarenessAPI, mapTrainingStatus } from '../services/api';

// Module Creation Modal Component
const CreateModuleModal = ({ isOpen, onClose, onModuleCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: 'Security',
    video_url: '',
    importance: 'Medium',
    status: 'active',
    sort_order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.duration) {
        throw new Error('Title, description, and duration are required');
      }

      const newModule = await awarenessAPI.createTrainingModule(formData);
      onModuleCreated(newModule);
      onClose();

      // Reset form
      setFormData({
        title: '',
        description: '',
        duration: '',
        category: 'Security',
        video_url: '',
        importance: 'Medium',
        status: 'active',
        sort_order: 0
      });
    } catch (err) {
      setError(err.message || 'Failed to create training module');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create New Training Module
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter module title"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter module description"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 25 min"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Security">Security</option>
                <option value="Compliance">Compliance</option>
                <option value="Operations">Operations</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Importance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Importance
              </label>
              <select
                name="importance"
                value={formData.importance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Video URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video URL (Optional)
              </label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.youtube.com/embed/..."
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Use YouTube embed URL format: https://www.youtube.com/embed/VIDEO_ID
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Awareness = () => {
  const navigate = useNavigate();
  const { currentUser, permissions } = useUser();
  const [activeTab, setActiveTab] = useState('training');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State for backend data
  const [trainingModules, setTrainingModules] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [stats, setStats] = useState({
    total_modules: 0,
    completed_modules: 0,
    in_progress_modules: 0,
    not_started_modules: 0,
    overall_progress: 0,
    average_score: 0
  });

  // Load data from backend
  const loadAwarenessData = async () => {
    if (!currentUser?.user_id) return;

    try {
      setLoading(true);
      setError(null);

      const [modulesData, progressData, statsData] = await Promise.all([
        awarenessAPI.getTrainingModules(),
        awarenessAPI.getUserProgress(currentUser.user_id),
        awarenessAPI.getCampaigns(),
        awarenessAPI.getUserTrainingStats(currentUser.user_id)
      ]);

      setTrainingModules(modulesData || []);
      setUserProgress(progressData || []);
      setStats(statsData || {
        total_modules: 0,
        completed_modules: 0,
        in_progress_modules: 0,
        not_started_modules: 0,
        overall_progress: 0,
        average_score: 0
      });

    } catch (err) {
      console.error('Failed to load awareness data:', err);
      setError('Failed to load training data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAwarenessData();
  }, [currentUser?.user_id]);

  // Handle new module creation
  const handleModuleCreated = (newModule) => {
    setTrainingModules(prev => [newModule, ...prev]);
    // Refresh stats to reflect new module
    loadAwarenessData();
  };

  const handleCreateModule = () => {
    setShowCreateModal(true);
  };

  // ... rest of your existing functions (getEnhancedTrainingModules, filteredTraining, etc.)
  // Merge module data with user progress
  const getEnhancedTrainingModules = () => {
    return trainingModules.map(module => {
      const progress = userProgress.find(p => p.module_id === module.module_id) || {};

      return {
        id: module.module_id,
        title: module.title,
        description: module.description,
        duration: module.duration,
        category: module.category,
        videoUrl: module.video_url,
        importance: module.importance || 'Medium',
        status: mapTrainingStatus(progress.status) || 'not-started',
        progress: progress.progress_percentage || 0,
        score: progress.score || 0,
        assignedDate: progress.started_at ? new Date(progress.started_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    });
  };

  // Filter training modules based on search and status
  const filteredTraining = getEnhancedTrainingModules().filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.category.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMap = {
      'all': () => true,
      'not_started': (status) => status === 'not-started',
      'in_progress': (status) => status === 'in-progress',
      'completed': (status) => status === 'completed'
    };

    const matchesStatus = statusMap[filterStatus] ? statusMap[filterStatus](module.status) : true;

    return matchesSearch && matchesStatus;
  });

  // Prepare data for CardSlider - Training Modules
  const trainingFields = filteredTraining.map((module, index) => {
    const actionButtons = [];

    if (module.status === 'not-started' || module.status === 'in-progress') {
      actionButtons.push(
        {
          type: "i",
          text: "faPlay",
          color: "#10b981",
          click: () => handleStartTraining(module.id),
          title: "Start Training"
        }
      );
    } else if (module.status === 'completed') {
      actionButtons.push(
        {
          type: "i",
          text: "faCertificate",
          color: "#f59e0b",
          click: () => handleViewCertificate(module.id),
          title: "View Certificate"
        }
      );
      actionButtons.push(
        {
          type: "i",
          text: "faEye",
          color: "#3b82f6",
          click: () => handleStartTraining(module.id),
          title: "Review Module"
        }
      );
    }

    // Add edit button for admins
    if (permissions.isAdmin) {
      actionButtons.push(
        {
          type: "i",
          text: "faEdit",
          color: "#6b7280",
          click: () => handleEditModule(module.id),
          title: "Edit Module"
        }
      );
    }

    return [
      { type: "t", text: index + 1 },
      {
        type: "t",
        text: module.title,
        title: module.description
      },
      { type: "t", text: module.category },
      {
        type: "b",
        text: module.status.replace('-', ' '),
        color: module.status === "completed"
          ? "#10b98199"
          : module.status === "in-progress"
            ? "#3b82f699"
            : "#6b728099"
      },
      {
        type: "t",
        text: `${module.progress}%`,
        color: module.progress === 100 ? "#10b981" : module.progress > 50 ? "#3b82f6" : "#f59e0b"
      },
      { type: "t", text: module.duration || 'N/A' },
      {
        type: "t",
        text: new Date(module.dueDate).toLocaleDateString(),
        color: new Date(module.dueDate) < new Date() && module.status !== 'completed' ? "#ef4444" : undefined
      },
      ...actionButtons
    ];
  });

  const handleStartTraining = (moduleId) => {
    navigate(`/app/training/${moduleId}`);
  };

  const handleViewCertificate = (moduleId) => {
    const module = getEnhancedTrainingModules().find(m => m.id === moduleId);
    const progress = userProgress.find(p => p.module_id === moduleId);

    if (progress?.status === 'completed') {
      alert(`Certificate of Completion for ${module?.title}\nScore: ${progress.score}%\nCompleted: ${new Date(progress.completed_at).toLocaleDateString()}`);
    }
  };

  const handleEditModule = (moduleId) => {
    // Navigate to module editor or open edit modal
    navigate(`/app/training-module-editor/${moduleId}`);
  };

  const handleCreateCampaign = () => {
    if (permissions.isAdmin) {
      // In a real app, this would open a campaign creation modal
      alert('Create new campaign functionality would open here');
    }
  };

  // ... rest of your existing JSX return statement
  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading training data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAwarenessData}
            className="button buttonStyle"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header with Create Button */}
      <div className="h2AndButtonContainer">
        <h2>Security Awareness & Training</h2>
        <div className="flex gap-4">
          {permissions.isAdmin && activeTab === 'training' && (
            <button className="button buttonStyle" onClick={handleCreateModule}>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Module
            </button>
          )}
          {permissions.isAdmin && activeTab === 'campaigns' && (
            <button className="button buttonStyle" onClick={handleCreateCampaign}>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Campaign
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="cardsContainer">
        <Card
          title="Overall Progress"
          value={`${stats.overall_progress || 0}%`}
          model={3}
          icon={faChartLine}
          iconColor="#3b82f6"
          subtitle="Training completion rate"
        />
        <Card
          title="Completed"
          value={stats.completed_modules || 0}
          model={1}
          icon={faCheckCircle}
          iconColor="#10b981"
          subtitle="Training modules"
        />
        <Card
          title="In Progress"
          value={stats.in_progress_modules || 0}
          model={2}
          icon={faClock}
          iconColor="#f59e0b"
          subtitle="Active training"
        />
        <Card
          title="Average Score"
          value={`${stats.average_score || 0}%`}
          model={3}
          icon={faCertificate}
          iconColor="#8b5cf6"
          subtitle="Completed modules"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-600 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'training'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            } rounded-t-lg`}
          onClick={() => setActiveTab('training')}
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" />
          Training Modules
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'campaigns'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            } rounded-t-lg`}
          onClick={() => setActiveTab('campaigns')}
        >
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          Awareness Campaigns
        </button>
      </div>

      {/* Training Modules Tab */}
      {activeTab === 'training' && (
        <div>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search training modules by title, description, or category..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {filteredTraining.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No training modules found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No training modules available yet'}
              </p>
              {permissions.isAdmin && (
                <button
                  className="button buttonStyle mt-4"
                  onClick={handleCreateModule}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Create Your First Module
                </button>
              )}
            </div>
          ) : (
            <CardSlider
              caption={{ text: "Security Awareness Training Modules" }}
              titles={["#", "Title", "Category", "Status", "Progress", "Duration", "Due Date", "Actions"]}
              sizes={[1, 12, 6, 6, 4, 4, 6, 6]}
              ids={filteredTraining.map(module => module.id)}
              fields={trainingFields}
            />
          )}
        </div>
      )}

      {/* Create Module Modal */}
      <CreateModuleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onModuleCreated={handleModuleCreated}
      />
    </div>
  );
};

export default Awareness;
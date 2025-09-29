// pages/Awareness.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faCheckCircle, 
  faClock, 
  faUsers, 
  faChartLine,
  faSearch,
  faFilter,
  faPlus,
  faEye,
  faCertificate
} from '@fortawesome/free-solid-svg-icons';
import Card from '../components/Card';
import CardSlider from '../components/CardSlider';
import { useUser } from '../hooks/useUser';

const Awareness = () => {
  const navigate = useNavigate();
  const { currentUser, permissions } = useUser();
  const [activeTab, setActiveTab] = useState('training');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Enhanced training modules with progress tracking
  const [trainingModules, setTrainingModules] = useState([
    {
      id: 1,
      title: "Phishing Awareness",
      description: "Learn to identify and report phishing attempts in emails, texts, and calls",
      duration: "25 min",
      category: "Security",
      status: "not-started",
      progress: 0,
      assignedDate: "2024-01-25",
      dueDate: "2024-02-25",
      videoUrl: "https://www.youtube.com/embed/Y7ix6RITXM0",
      importance: "High"
    },
    {
      id: 2,
      title: "Password Security", 
      description: "Creating and managing secure passwords and authentication methods",
      duration: "20 min",
      category: "Security",
      status: "not-started", 
      progress: 0,
      assignedDate: "2024-01-28",
      dueDate: "2024-02-28",
      videoUrl: "https://www.youtube.com/embed/5Mz2xL3F3mk",
      importance: "High"
    },
    {
      id: 3,
      title: "Data Protection",
      description: "Proper classification, handling and protection of sensitive information",
      duration: "30 min", 
      category: "Compliance",
      status: "not-started",
      progress: 0,
      assignedDate: "2024-02-01", 
      dueDate: "2024-03-01",
      videoUrl: "https://www.youtube.com/embed/lB_tc1MLI8I",
      importance: "Medium"
    },
    {
      id: 4,
      title: "Ransomware Defense",
      description: "Understanding and preventing ransomware and malware threats",
      duration: "25 min",
      category: "Security",
      status: "not-started",
      progress: 0,
      assignedDate: "2024-02-05",
      dueDate: "2024-03-05",
      videoUrl: "https://www.youtube.com/embed/leRw2nbp-jU",
      importance: "High"
    },
    {
      id: 5,
      title: "Remote Work Security",
      description: "Security best practices for working remotely and protecting company data",
      duration: "35 min",
      category: "Operations", 
      status: "not-started",
      progress: 0,
      assignedDate: "2024-02-10",
      dueDate: "2024-03-10",
      videoUrl: "https://www.youtube.com/embed/IYbgOStzavo",
      importance: "Medium"
    }
  ]);

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Q1 Security Awareness",
      description: "Quarterly security awareness campaign covering all essential topics",
      participants: 45,
      completionRate: 78,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      status: "active",
      modules: [1, 2, 4]
    },
    {
      id: 2,
      title: "Data Protection Refresh",
      description: "Annual data protection and compliance training refresh",
      participants: 52,
      completionRate: 92,
      startDate: "2024-01-10",
      endDate: "2024-01-31",
      status: "completed",
      modules: [3]
    },
    {
      id: 3,
      title: "Remote Work Initiative",
      description: "Focused campaign on secure remote work practices",
      participants: 48,
      completionRate: 65,
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      status: "upcoming",
      modules: [5]
    }
  ]);

  // Load progress from localStorage on component mount and refresh
  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('trainingProgress') || '{}');
    setTrainingModules(prev => 
      prev.map(module => {
        const moduleProgress = progress[module.id];
        if (moduleProgress) {
          return {
            ...module,
            status: moduleProgress.completed ? 'completed' : 'in-progress',
            progress: moduleProgress.score || (moduleProgress.completed ? 100 : 50)
          };
        }
        return module;
      })
    );
  }, [refreshTrigger]);

  // Listen for training progress updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('trainingProgressUpdated', handleProgressUpdate);
    return () => {
      window.removeEventListener('trainingProgressUpdated', handleProgressUpdate);
    };
  }, []);

  // Filter training modules based on search and status
  const filteredTraining = trainingModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || module.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalModules: trainingModules.length,
    completedModules: trainingModules.filter(m => m.status === 'completed').length,
    inProgressModules: trainingModules.filter(m => m.status === 'in-progress').length,
    notStartedModules: trainingModules.filter(m => m.status === 'not-started').length,
    overallProgress: Math.round(
      trainingModules.reduce((acc, module) => acc + module.progress, 0) / trainingModules.length
    ),
    averageScore: Math.round(
      trainingModules.reduce((acc, module) => {
        const progress = JSON.parse(localStorage.getItem('trainingProgress') || '{}');
        const moduleProgress = progress[module.id];
        return acc + (moduleProgress?.score || 0);
      }, 0) / trainingModules.filter(m => trainingModules.some(tm => tm.id === m.id && JSON.parse(localStorage.getItem('trainingProgress') || '{}')[tm.id]?.completed)).length || 1
    )
  };

  const handleStartTraining = (moduleId) => {
    navigate(`/app/training/${moduleId}`);
  };

  const handleViewCertificate = (moduleId) => {
    const progress = JSON.parse(localStorage.getItem('trainingProgress') || '{}');
    const moduleProgress = progress[moduleId];
    const module = trainingModules.find(m => m.id === moduleId);
    
    if (moduleProgress?.completed) {
      alert(`Certificate of Completion for ${module?.title}\nScore: ${moduleProgress.score}%\nCompleted: ${new Date(moduleProgress.completedAt).toLocaleDateString()}`);
    }
  };

  const handleCreateCampaign = () => {
    if (permissions.isAdmin) {
      // In a real app, this would open a campaign creation modal
      alert('Create new campaign functionality would open here');
    }
  };

  // Prepare data for CardSlider
  const trainingFields = filteredTraining.map((module, index) => {
    const actionButtons = [];
    const progress = JSON.parse(localStorage.getItem('trainingProgress') || '{}');
    const moduleProgress = progress[module.id];
    
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
      { type: "t", text: module.duration },
      { 
        type: "t", 
        text: new Date(module.dueDate).toLocaleDateString(),
        color: new Date(module.dueDate) < new Date() && module.status !== 'completed' ? "#ef4444" : undefined
      },
      ...actionButtons
    ];
  });

  const campaignFields = campaigns.map((campaign, index) => [
    { type: "t", text: index + 1 },
    { type: "t", text: campaign.title },
    { type: "t", text: campaign.description },
    { 
      type: "b", 
      text: campaign.status,
      color: campaign.status === "active" 
        ? "#10b98199" 
        : campaign.status === "completed"
        ? "#3b82f699"
        : "#f59e0b99"
    },
    { type: "t", text: campaign.participants },
    { type: "t", text: `${campaign.completionRate}%` },
    { type: "t", text: new Date(campaign.startDate).toLocaleDateString() },
    { type: "t", text: new Date(campaign.endDate).toLocaleDateString() }
  ]);

  return (
    <div className="container">
      <div className="h2AndButtonContainer">
        <h2>Security Awareness & Training</h2>
        {permissions.isAdmin && activeTab === 'campaigns' && (
          <button className="button buttonStyle" onClick={handleCreateCampaign}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            New Campaign
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="cardsContainer">
        <Card 
          title="Overall Progress" 
          value={`${stats.overallProgress}%`} 
          model={3} 
          icon={faChartLine}
          iconColor="#3b82f6"
          subtitle="Training completion rate"
        />
        <Card 
          title="Completed" 
          value={stats.completedModules} 
          model={1} 
          icon={faCheckCircle}
          iconColor="#10b981"
          subtitle="Training modules"
        />
        <Card 
          title="In Progress" 
          value={stats.inProgressModules} 
          model={2} 
          icon={faClock}
          iconColor="#f59e0b"
          subtitle="Active training"
        />
        <Card 
          title="Average Score" 
          value={`${stats.averageScore}%`} 
          model={3} 
          icon={faCertificate}
          iconColor="#8b5cf6"
          subtitle="Completed modules"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-600 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'training'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          } rounded-t-lg`}
          onClick={() => setActiveTab('training')}
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" />
          Training Modules
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'campaigns'
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
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
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
                Try adjusting your search or filter criteria
              </p>
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

      {/* Awareness Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div>
          <CardSlider
            caption={{ text: "Security Awareness Campaigns" }}
            titles={["#", "Title", "Description", "Status", "Participants", "Completion", "Start Date", "End Date"]}
            sizes={[1, 10, 12, 6, 4, 4, 5, 5]}
            ids={campaigns.map(campaign => campaign.id)}
            fields={campaignFields}
          />
        </div>
      )}
    </div>
  );
};

export default Awareness;
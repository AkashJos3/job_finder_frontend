import type { PageView } from '../../App';
import { API_URL } from '../../lib/api';
import {
  Bell, Search, MapPin, Filter, ChevronRight, Plus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { StudentSidebar } from '../../components/layout/StudentSidebar';

interface StudentApplicationsProps {
  onNavigate: (view: PageView) => void;
  onLogout: () => void;
}

export function StudentApplications({ onNavigate, onLogout }: StudentApplicationsProps) {
  const [activeTab, setActiveTab] = useState<'applied' | 'accepted' | 'rejected'>('applied');

  const [appsData, setAppsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`${API_URL}/api/applications/student`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setAppsData(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applications = {
    applied: appsData.filter(a => a.status === 'pending'),
    accepted: appsData.filter(a => a.status === 'accepted' || a.status === 'approved'),
    rejected: appsData.filter(a => a.status === 'rejected'),
  };

  const currentApplications = applications[activeTab];

  const getAppCardProps = (app: any) => {
    let statusLabel = app.status;
    let statusColor = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
    let icon = '💼';
    let iconBg = 'bg-blue-100 dark:bg-blue-900/20';

    if (app.status === 'pending') {
      statusColor = 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400';
      statusLabel = 'Pending Review';
    } else if (app.status === 'accepted' || app.status === 'approved') {
      statusColor = 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400';
      statusLabel = 'Accepted';
      iconBg = 'bg-green-100 dark:bg-green-900/40';
      icon = '🎉';
    } else if (app.status === 'rejected') {
      statusColor = 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400';
      statusLabel = 'Rejected';
      iconBg = 'bg-red-100 dark:bg-red-900/40';
      icon = '❌';
    }

    return { statusLabel, statusColor, icon, iconBg };
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] dark:bg-[#121212] flex transition-colors duration-200">
      <StudentSidebar activeView="student-applications" onNavigate={onNavigate} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => onNavigate('student-jobs')}
                  className="text-gray-600 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white font-medium transition-colors"
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => onNavigate('student-applications')}
                  className="text-[#F5C518] font-semibold border-b-2 border-[#F5C518] pb-1"
                >
                  My Applications
                </button>
                <button
                  onClick={() => onNavigate('student-saved')}
                  className="text-gray-600 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white font-medium transition-colors"
                >
                  Saved
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('student-dashboard')}
                className="w-10 h-10 bg-white dark:bg-[#2D2D2D] border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative"
                title="Notifications"
              >
                <span className="w-5 h-5 text-gray-600 dark:text-gray-400">??</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <p className="text-gray-500 dark:text-gray-400 mb-8">Track your progress for local part-time opportunities.</p>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Tabs */}
            <div className="flex gap-2">
              {(['applied', 'accepted', 'rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === tab
                    ? 'bg-[#F5C518] text-[#1A1A1A]'
                    : 'bg-white dark:bg-[#2D2D2D] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-[#1A1A1A]/20 dark:bg-black/20' : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                    {applications[tab].length}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigate('student-jobs')}
              className="btn-primary flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Find More Jobs
            </button>
          </div>

          {/* Applications Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">Loading your applications...</div>
            ) : currentApplications.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">No {activeTab} applications found.</div>
            ) : currentApplications.map((app: any) => {
              const { statusLabel, statusColor, icon, iconBg } = getAppCardProps(app);
              const jobDetails = app.jobs || {};
              const companyName = jobDetails.company_name || jobDetails.profiles?.full_name || 'Unknown Company';
              const avatarUrl = jobDetails.profiles?.avatar_url;

              return (
                <div key={app.id} className="bg-white dark:bg-[#2D2D2D] rounded-2xl p-6 card-shadow hover:card-shadow-hover border border-transparent dark:border-gray-800 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}>
                        {icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1A1A1A] dark:text-white truncate">{jobDetails.title || 'Unknown Job'}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{companyName}</p>
                    </div>
                  </div>

                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${statusColor}`}>
                    {statusLabel}
                  </span>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      {jobDetails.location || 'Remote/Campus'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-600 dark:text-green-400 font-semibold">{jobDetails.wage || 'Competitive'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-400 dark:text-gray-500">Applied {new Date(app.created_at).toLocaleDateString()}</span>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-[#F5C518] font-semibold text-sm flex items-center gap-1 hover:underline"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Keep Applying Card */}
            {activeTab === 'applied' && (
              <div className="bg-[#1A1A1A] rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center min-h-[280px] card-shadow border border-transparent dark:border-gray-800">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-[#F5C518]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Keep Applying!</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Increase your chances by applying to more positions near campus.
                </p>
                <button
                  onClick={() => onNavigate('student-jobs')}
                  className="btn-primary"
                >
                  Browse New Jobs
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {currentApplications.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white transition-colors">
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F5C518] text-[#1A1A1A] font-semibold">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors">
                3
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-gray-100 dark:border-gray-800 mt-auto">
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            © 2026 AfterBell. Helping students earn and learn.
          </p>
        </footer>
      </main>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedApp(null)}
          ></div>
          <div className="bg-white dark:bg-[#2D2D2D] border border-transparent dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 p-8">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">{selectedApp.jobs?.title || 'Unknown Job'}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">{selectedApp.jobs?.company_name || selectedApp.jobs?.profiles?.full_name || 'Unknown Company'}</p>

            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-2xl flex flex-col sm:flex-row gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getAppCardProps(selectedApp).statusColor}`}>
                    {getAppCardProps(selectedApp).statusLabel}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Wage</p>
                  <p className="text-[#1A1A1A] dark:text-white font-semibold mt-1">₹{selectedApp.jobs?.wage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Location</p>
                  <p className="text-[#1A1A1A] dark:text-white font-semibold mt-1">{selectedApp.jobs?.location}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#1A1A1A] dark:text-white mb-3">Job Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
                  {selectedApp.jobs?.description || 'No description provided.'}
                </p>
              </div>

              {selectedApp.status === 'pending' && (
                <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 p-4 rounded-xl text-sm mt-4">
                  Your application is currently being reviewed by the employer. You will be notified once a decision is made.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



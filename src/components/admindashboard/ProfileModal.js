import React from 'react';
import { X, Mail, Building2, Hash, User, Settings } from 'lucide-react';

const ProfileModal = ({ isOpen = true, onClose = () => {}, user = {} }) => {
  const userFields = [
    {
      key: 'authorizedEmail',
      label: 'Email',
      value: user?.authorizedEmail || 'tashu2@gmail.com',
      icon: Mail,
      color: 'text-blue-600'
    },
    {
      key: 'companyCode', 
      label: 'Code',
      value: user?.companyCode || 'TTXZOX',
      icon: Hash,
      color: 'text-emerald-600'
    },
    {
      key: 'companyName',
      label: 'Company',
      value: user?.companyName || 'Tashu Technologies',
      icon: Building2,
      color: 'text-purple-600'
    },
    {
      key: 'department',
      label: 'Department',
      value: user?.department || 'Admin',
      icon: Settings,
      color: 'text-orange-600'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
        
        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Profile</h2>
              <p className="text-white/90 text-xs">User Details</p>
            </div>
          </div>
        </div>

        {/* Compact Content - No Scrolling Needed */}
        <div className="p-5 space-y-3">
          {userFields.map((field) => {
            const IconComponent = field.icon;
            return (
              <div key={field.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className={`p-2 rounded-lg bg-white shadow-sm ${field.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-500 mb-0.5">
                    {field.label}
                  </div>
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {field.value}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Action Button */}
          <div className="pt-2 mt-4 border-t border-gray-100">
            <button 
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;
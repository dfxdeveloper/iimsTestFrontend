import React, { useState, useEffect } from "react";
import AddCompany from "./AddCompany";
import CompanyModules from "./CompanyModules";

const CompanyTabs = ({ onClose, onSuccess, editMode, companyData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [moduleType, setModuleType] = useState();
  const [subModuleId, setSubModuleId] = useState()
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(editMode || false)
  useEffect(() => {
    if (editMode && companyData?.industry) {
      setSelectedIndustryId(companyData.industry);
      setModuleType(companyData.moduleData.map((e) => e.moduleType));
      setSubModuleId(companyData.moduleData.map((e) => e.data));
      setIsFormSubmitted(true);
    }
  }, [editMode, companyData?.industry]);

  const handleFormSuccess = (response) => {
    setIsFormSubmitted(true);
    setActiveTab(1);
    if (onSuccess && typeof onSuccess === "function") {
      onSuccess(response);
    }
  };

  const tabs = [
    {
      id: 0,
      label: "Company information",
      component: (props) => (
        <AddCompany
          {...props}
          onIndustrySelect={setSelectedIndustryId}
          onSuccess={handleFormSuccess}
        />
      ),
    },
    {
      id: 1,
      label: "Company Modules",
      component: ({ selectedIndustryId }) =>
        selectedIndustryId ? (
          <CompanyModules id={selectedIndustryId} companyId={companyData._id} moduleType={moduleType} subModuleId={subModuleId} />
        ) : (
          <div>Please select an industry first.</div>
        ),
    },
  ];

  const handleTabChange = (tabId) => {
    if (tabId === 1 && !isFormSubmitted) {
      return;
    }
    setActiveTab(tabId);
  };

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="w-full py-6 px-4 max-w-7xl mx-auto">
      <div className="bg-white">
        <div className="flex gap-10 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-1 px-4 text-lg font-archivo font-bold ${
                activeTab === tab.id
                  ? "text-black rounded-lg bg-[#BDECFF]"
                  : "text-black bg-gray-50 cursor-pointer"
              } ${
                tab.id === 1 && !isFormSubmitted
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <div className="flex items-center">
                {tab.id === 0 && (
                  <img
                    src="/assets/officeTab.svg"
                    alt="Logo"
                    className="h-4 sm:h-6 md:h-6 mr-2"
                  />
                )}
                {tab.id === 1 && (
                  <img
                    src="/assets/officeTab2.svg"
                    alt="Logo"
                    className="h-4 sm:h-6 md:h-6 mr-2"
                  />
                )}
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        <ActiveComponent
          onClose={onClose}
          onSuccess={handleFormSuccess}
          editMode={editMode}
          companyData={companyData}
          selectedIndustryId={selectedIndustryId}
        />
      </div>
    </div>
  );
};

export default CompanyTabs;

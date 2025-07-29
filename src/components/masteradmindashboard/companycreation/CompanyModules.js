import React, { useState, useEffect } from "react";
import { api } from "../../../services/config/axiosInstance";
import PIModule from "./modules/PIModule";

function CompanyModules({ companyId, moduleType, subModuleId }) {
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [loading, setLoading] = useState(false);
  const [moduleData, setModuleData] = useState([]); 
  const [showModulePage, setShowModulePage] = useState(false);
  const [currentModuleData, setCurrentModuleData] = useState(null);

  const MODULE_DISPLAY_NAMES = {
    "Performa Invoice": "PICompanyModule",
    "Purchase Order": "PurchaseOrder",
    "Work Order": "WorkOrderModule",
    "Goods Receive Note": "GrnModule",
    Indent: "IndentModule",
    "Fabric Indent": "CommericalInvoiceModule",
  };

  const MODULE_VALUES_TO_NAMES = Object.entries(MODULE_DISPLAY_NAMES).reduce(
    (acc, [key, value]) => {
      acc[value] = key;
      return acc;
    },
    {}
  );

  const moduleTemplateImages = {
    "Performa Invoice": "/assets/pi-temp.png",
    "Purchase Order": "/assets/purchase-order.png",
    "Work Order": "/assets/work-order.png",
    "Goods Receive Note": "/assets/goods-receive-note.png",
    Indent: "/assets/indent.png",
    "Fabric Indent": "/assets/fabric-indent.png",
  };

  const handleViewTemplate = (module) => {
    setSelectedModule(module);
    const moduleTypeKey = MODULE_DISPLAY_NAMES[module];
    
    // Find the module data using moduleName instead of moduleType
    const correspondingModuleData = moduleData.find(
      (mod) => mod.moduleName === moduleTypeKey
    );

    if (correspondingModuleData) {
      const templateDataToPass = {
        moduleType: correspondingModuleData.moduleName, // Use moduleName
        id: correspondingModuleData.data._id, // Get ID from data object
        data: correspondingModuleData.data // Pass the entire data object
      };
      setCurrentModuleData(templateDataToPass);
      setShowModulePage(true);
    } else {
      console.error("No module data found for:", module);
    }
  };

  const handleBackToTemplates = () => {
    setShowModulePage(false);
    setCurrentModuleData(null);
    setSelectedModule("");
  };

  const fetchIndustryModule = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/companies/${companyId}/${moduleType}`)
      
      if (response?.data) {
        const industryData = response.data;
        if (industryData.moduleName && industryData.data) {
          setModuleData([industryData]); 
          const displayName = MODULE_VALUES_TO_NAMES[industryData.moduleName];
          if (displayName) {
            setSelectedModules([displayName]); 
          }
        } 
      }
    } catch (error) {
      console.error("Error fetching industry module:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchIndustryModule();
    } 
  }, [companyId]);

  const renderModulePage = () => {
    if (!currentModuleData) return null;

    if (currentModuleData.moduleType === 'PICompanyModule') {
      return (
        <PIModule 
          moduleType={currentModuleData.moduleType} 
          id={companyId} 
          subModuleId={subModuleId}
          data={currentModuleData.data}
          onBack={handleBackToTemplates} 
        />
      );
    }
    // if (currentModuleData.moduleType === 'PurchaseOrder') {
    //   return <PurchaseOrderComponent moduleType={currentModuleData.moduleType} id={currentModuleData.id} onBack={handleBackToTemplates} />;
    // }

    // Generic module page for now
    return (
      <div className="p-6">
        <div className="mb-4">
          <button
            onClick={handleBackToTemplates}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            ← Back to Templates
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">
            {MODULE_VALUES_TO_NAMES[currentModuleData.moduleType]} Module
          </h2>
          <div className="space-y-2">
            <p><strong>Module Type:</strong> {currentModuleData.moduleType}</p>
            <p><strong>Module ID:</strong> {currentModuleData.id}</p>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-800">
              Replace this section with your specific module component.
              Pass moduleType="{currentModuleData.moduleType}" and id="{currentModuleData.id}" as props.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (showModulePage) {
    return renderModulePage();
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (selectedModules.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        <div>No modules available for this industry.</div>
        <div className="mt-2 text-sm">
          <div>Debug Info:</div>
          <div>Company ID: {companyId}</div>
          <div>Module Type: {moduleType}</div>
          <div>Module Data Length: {moduleData.length}</div>
          <div>Selected Modules: {JSON.stringify(selectedModules)}</div>
          {moduleData.length > 0 && (
            <div>Module Data: {JSON.stringify(moduleData[0])}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-6 mb-4 ">
        <h3 className="text-lg font-medium mb-3 px-12">Templates</h3>
        <div className="flex flex-wrap gap-4 justify-center bg-blue-50 p-4 rounded-md">
          {selectedModules.map((module, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white rounded-md shadow-sm overflow-hidden w-40"
            >
              <div className="relative">
                <img
                  src={moduleTemplateImages[module]}
                  alt={`${module} template`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                  <button
                    className="bg-[#2B86AA] text-white py-1 px-4 rounded-md text-sm"
                    onClick={() => handleViewTemplate(module)}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="p-2 text-center">
                <span className="text-sm font-medium text-gray-700">
                  {module}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompanyModules;
import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ChevronUp, ChevronDown } from "lucide-react";
import { api } from "../../../services/config/axiosInstance";
import { showToast } from "../../../services/config/toast";
import { usePartners } from "../../../services/context/partners";
import { useAuth } from "../../../services/context/auth";
import { useCompany } from "../../../services/context/company";

const getDefaultRowData = (columns) => {
  const defaultRow = {};
  if (columns && Array.isArray(columns)) {
    columns.forEach((col, index) => {
      defaultRow[`col_${index}`] = "";
    });
  }
  return defaultRow;
};

export default function AddProformaInvoice({
  id,
  onClose,
  onSave,
  editMode = false,
  reset,
}) {
  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const today = new Date().toISOString().split("T")[0];

  const [companyDetails, setCompanyDetails] = useState({
    date: today,
    companyName: "",
    clientName: "",
    name: "",
    city: "",
    reference: "",
    customerCode: "",
    piNumber: "",
    contactPerson: "",
    companyCode: "",
    customerAddress: "",
    remark: "",
  });

  const [data, setData] = useState({
    headers: [],
    tableHeader: [],
    productCategory: {},
    materialDetails: [],
    termsAndConditions: "",
  });

  const initialDefaultData = useRef({
    headers: [],
    tableHeader: [],
    productCategory: {},
  });

  const [defaultFields, setDefaultFields] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [defaultCategoryFields, setDefaultCategoryFields] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([{ id: 1 }]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryFields, setCategoryFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const { partners, setPartners } = usePartners();
  const { company } = useCompany();
  const { user } = useAuth();
  const [newRowId, setNewRowId] = useState(null);
  const [hasFetchedPiData, setHasFetchedPiData] = useState(false);
  const companyId = user?.companyId;
  const companyAddressParts = [company?.address1, company?.address2].filter(
    Boolean
  );
  const combinedCompanyAddress =
    companyAddressParts.length > 0 ? companyAddressParts.join(", ") : "";

  const mergeCustomFields = (existingFields, newData) => {
    const fieldMap = new Map();
    const defaultFieldKeys = defaultFields.map((field) => field.key);
    existingFields.forEach((field) => {
      if (
        !defaultFieldKeys.includes(field.key) &&
        !reservedKeys.includes(field.key)
      ) {
        fieldMap.set(field.key, field);
      }
    });

    Object.entries(newData).forEach(([key, value]) => {
      if (defaultFieldKeys.includes(key) || reservedKeys.includes(key)) {
        return;
      }
      if (!fieldMap.has(key) && key !== "customerAddress" && key !== "remark") {
        fieldMap.set(key, {
          id: Date.now() + Math.random(),
          label: capitalizeFirstLetter(key),
          value: value || "",
          isDefault: false,
          key,
          isCompanyDefault: false,
          isIndustryDefault: false,
        });
      } else if (fieldMap.has(key)) {
        const existingField = fieldMap.get(key);
        fieldMap.set(key, {
          ...existingField,
          value: value || existingField.value,
        });
      }
    });

    return Array.from(fieldMap.values());
  };

  const reservedKeys = [
    "_id",
    "partner",
    "piNumber",
    "piDate",
    "items",
    "companyCode",
    "companyName",
    "clientName",
    "name",
    "city",
    "reference",
    "contactPerson",
    "termsAndConditions",
    "customerCode",
    "customerAddress",
    "remark",
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  useEffect(() => {
    if (reset) {
      setCustomFields([]);
    }
  }, [reset]);

  useEffect(() => {
    if (
      columns.length > 0 &&
      tableData.length === 1 &&
      !tableData[0].hasOwnProperty("col_0")
    ) {
      setTableData([{ id: 1, ...getDefaultRowData(columns) }]);
    }
  }, [columns]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsFetching(true);
        setApiError(null);

        if (!partners || partners.length === 0) {
          const partnersResponse = await api.get("/partners");
          if (partnersResponse.data && Array.isArray(partnersResponse.data)) {
            setPartners(partnersResponse.data);
          } else {
            throw new Error("No partners data found");
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch initial data";
        setApiError(errorMessage);
        showToast.error(`Failed to fetch initial data: ${errorMessage}`);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialData();
  }, [partners, setPartners]);

  const resetState = () => {
    setCustomFields([]);
    setColumns([]);
    setCategoryFields([]);
    setDefaultFields([]);
    setDefaultColumns([]);
    setDefaultCategoryFields([]);
    setCategories([]);
    setSelectedCategories([]);
    setEditorValue("");
    setCompanyDetails({
      date: today,
      companyName: "",
      clientName: "",
      name: "",
      city: "",
      reference: "",
      customerCode: "",
      piNumber: "",
      contactPerson: "",
      companyCode: "",
      customerAddress: "",
      remark: "",
    });
    setData({
      headers: [],
      tableHeader: [],
      productCategory: {},
      materialDetails: [],
      termsAndConditions: "",
    });
    setTableData([{ id: 1 }]);
    setNewRowId(null);
    setHasFetchedPiData(false);
  };

  useEffect(() => {
    let isMounted = true;

    if (editMode && id && !hasFetchedPiData && isMounted) {
      const fetchPIData = async () => {
        setIsFetching(true);
        setApiError(null);
        try {
          setCustomFields([]);
          setCompanyDetails({
            date: today,
            companyName: "",
            clientName: "",
            name: "",
            city: "",
            reference: "",
            customerCode: "",
            piNumber: "",
            contactPerson: "",
            companyCode: "",
            customerAddress: "",
            remark: "",
          });

          const [defaultResponse, piResponse] = await Promise.all([
            api.get(`/companies/${companyId}/PICompanyModule`),
            api.get(`/pi/${id}`),
          ]);

          let templateData = {
            headers: [],
            tableHeader: [],
            productCategory: {},
          };
          if (defaultResponse.data && defaultResponse.data.data) {
            templateData = defaultResponse.data.data;
            setData(templateData);
            loadTemplateData(templateData, true);
            if (templateData.tableHeader) {
              const cleanTableHeader = templateData.tableHeader
                .filter((col) => col && col.displayName && col.key)
                .map((col) => ({
                  label: capitalizeFirstLetter(col.displayName.trim()),
                  key: col.key,
                  isCompanyDefault: col.isCompanyDefault ?? false,
                  isIndustryDefault: col.isIndustryDefault ?? false,
                  _id: col._id,
                }));
              const defaultCols = cleanTableHeader
                .filter((col) => col.isCompanyDefault)
                .map((col) => ({
                  label: col.label,
                  key: col.key,
                  isDefault: true,
                  isCompanyDefault: col.isCompanyDefault,
                  isIndustryDefault: col.isIndustryDefault,
                }));
              const customCols = cleanTableHeader
                .filter((col) => !col.isCompanyDefault)
                .map((col) => ({
                  label: col.label,
                  key: col.key,
                  isDefault: false,
                  isCompanyDefault: col.isCompanyDefault,
                  isIndustryDefault: col.isIndustryDefault,
                }));
              setColumns([...defaultCols, ...customCols]);
              setDefaultColumns(defaultCols);
            }
            if (templateData.productCategory) {
              setCategories(Object.keys(templateData.productCategory || {}));
            }
          }

          let piData;
          if (
            piResponse.data &&
            piResponse.data.data &&
            Array.isArray(piResponse.data.data)
          ) {
            piData = piResponse.data.data[0];
          } else if (piResponse.data && !piResponse.data.data) {
            piData = piResponse.data;
          } else {
            throw new Error("Unexpected API response structure");
          }
          if (!piData) {
            throw new Error("No PI data found in response");
          }

          const additionalHeaders = {};
          Object.keys(piData).forEach((key) => {
            if (!reservedKeys.includes(key)) {
              additionalHeaders[key] = piData[key] || "";
            }
          });

          const uniqueAdditionalHeaders = Object.fromEntries(
            Object.entries(additionalHeaders).filter(
              ([key], index, self) =>
                index === self.findIndex((item) => item[0] === key)
            )
          );

          const addressParts = [
            piData.partner?.address1,
            piData.partner?.address2,
            piData.partner?.address3,
          ].filter(Boolean);
          const combinedAddress =
            addressParts.length > 0 ? addressParts.join(", ") : "";

          setCompanyDetails({
            date: piData.piDate ? piData.piDate.split("T")[0] : today,
            companyName: piData.companyName || "",
            clientName: piData.partner?.clientName || piData.name || "",
            city: piData.partner?.city || piData.city || "",
            reference: piData.reference || "",
            customerCode:
              piData.customerCode || piData.partner?.customerCode || "",
            piNumber: piData.piNumber || "",
            contactPerson:
              piData.partner?.contactPerson || piData.contactPerson || "",
            companyCode: piData.companyCode || "",
            customerAddress: combinedAddress,
            remark: piData.remark || "",
            ...uniqueAdditionalHeaders,
          });

          const mergedFields = mergeCustomFields([], {
            ...uniqueAdditionalHeaders,
          });
          setCustomFields(mergedFields);
          if (piData.termsAndConditions) {
            setEditorValue(piData.termsAndConditions);
          }

          if (piData.items && piData.items.length > 0) {
            const newCategoryFields = piData.items.map((item, index) => {
              const categoryName = item.productCategory;
              const templateCategoryFields =
                templateData.productCategory?.[categoryName] || [];
              const fields = templateCategoryFields
                .filter((field) => field && field.displayName && field.key)
                .map((field, fieldIndex) => ({
                  id: `f${Date.now()}_${fieldIndex}_${index}`,
                  label: capitalizeFirstLetter(field.displayName.trim()),
                  value: item[field.key] || "",
                  isDefault: field.isCompanyDefault,
                  key: field.key,
                  isCompanyDefault: field.isCompanyDefault,
                  isIndustryDefault: field.isIndustryDefault,
                }));
              return {
                id: Date.now() + Math.random() + index,
                categoryName,
                isDefault: fields.some((f) => f.isCompanyDefault),
                expanded: false,
                fields,
              };
            });
            setCategoryFields(newCategoryFields);
            setSelectedCategories([
              ...new Set(piData.items.map((item) => item.productCategory)),
            ]);
          }
          setHasFetchedPiData(true);
        } catch (error) {
          console.error("Error fetching PI data:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch PI data";
          setApiError(errorMessage);
          showToast.error(`Failed to fetch PI data: ${errorMessage}`);
        } finally {
          setIsFetching(false);
        }
      };
      fetchPIData();
    }
    return () => {
      isMounted = false;
    };
  }, [editMode, id, companyId, hasFetchedPiData]);

  useEffect(() => {
    const loadData = async () => {
      resetState();
      initialDefaultData.current = {
        headers: [],
        tableHeader: [],
        productCategory: {},
      };

      try {
        setIsFetching(true);
        setApiError(null);

        const defaultResponse = await api.get(
          `/companies/${companyId}/PICompanyModule`
        );
        if (defaultResponse.data && defaultResponse.data.data) {
          initialDefaultData.current = {
            headers: defaultResponse.data.data.headers || [],
            tableHeader: defaultResponse.data.data.tableHeader || [],
            productCategory: defaultResponse.data.data.productCategory || {},
          };
          setData(defaultResponse.data.data);
          loadTemplateData(defaultResponse.data.data, true);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load data";
        setApiError(errorMessage);
        showToast.error(`Failed to load data: ${errorMessage}`, {
          duration: 3000,
        });
      } finally {
        setIsFetching(false);
      }
    };
    if (!editMode) {
      loadData();
    }
  }, [editMode, companyId]);

  useEffect(() => {
    if (editMode && id && columns.length > 0) {
      const fetchPIData = async () => {
        try {
          const response = await api.get(`/pi/${id}`);
          let piData;
          if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data)
          ) {
            piData = response.data.data[0];
          } else if (response.data && !response.data.data) {
            piData = response.data;
          } else {
            throw new Error("Unexpected API response structure");
          }

          if (piData && piData.items && piData.items.length > 0) {
            const mappedTableData = piData.items.map((item, index) => {
              const row = { id: index + 1, _id: item._id };
              columns.forEach((col, colIndex) => {
                const key = col.key.toLowerCase();
                if (key === "productcategory") {
                  row[`col_${colIndex}`] = item.productCategory || "";
                } else if (key === "articlename") {
                  row[`col_${colIndex}`] = item.articleName || "";
                } else if (key === "hsncode") {
                  row[`col_${colIndex}`] = item.hsnCode || "";
                } else if (key === "rateperunit") {
                  row[`col_${colIndex}`] = item.ratePerUnit || "";
                } else if (key === "gst%" || key === "gst") {
                  row[`col_${colIndex}`] = item.gst || "";
                } else if (key === "totalamount") {
                  row[`col_${colIndex}`] =
                    item.totalAmount ||
                    calculateTotalAmount(
                      item.quantity || "0",
                      item.ratePerUnit || "0",
                      item.gst || "0"
                    );
                } else if (key === "uom") {
                  row[`col_${colIndex}`] = item.uom || "";
                } else {
                  row[`col_${colIndex}`] = item[col.key] || "";
                }
              });
              return row;
            });
            setTableData(mappedTableData);
          }
        } catch (error) {
          console.error("Error mapping PI data to table:", error);
          showToast.error(`Failed to map PI data to table: ${error.message}`);
        }
      };
      fetchPIData();
    }
  }, [editMode, id, columns]);

  const loadTemplateData = (data, isDefault = false) => {
    if (data.headers) {
      const cleanHeaders = data.headers
        .filter((header) => header && header.displayName && header.key)
        .map((header) => ({
          label: capitalizeFirstLetter(header.displayName.trim()),
          key: header.key,
          isCompanyDefault: header.isCompanyDefault ?? false,
          isIndustryDefault: header.isIndustryDefault ?? false,
          _id: header._id,
        }));

      const uniqueHeaders = cleanHeaders.reduce((acc, current) => {
        const existingIndex = acc.findIndex((item) => item.key === current.key);
        if (existingIndex === -1) {
          acc.push(current);
        } else {
          if (
            current.isCompanyDefault &&
            !acc[existingIndex].isCompanyDefault
          ) {
            acc[existingIndex] = current;
          }
        }
        return acc;
      }, []);

      if (isDefault) {
        setDefaultFields(
          uniqueHeaders.filter((header) => header.isCompanyDefault)
        );
        setCustomFields(
          uniqueHeaders
            .filter((header) => !header.isCompanyDefault)
            .map((header, index) => ({
              id: Date.now() + index,
              label: header.label,
              value: "",
              isDefault: false,
              key: header.key,
              isCompanyDefault: header.isCompanyDefault,
              isIndustryDefault: header.isIndustryDefault,
              _id: header._id,
            }))
        );
      } else {
        const defaultHeaders = uniqueHeaders.filter(
          (header) => header.isCompanyDefault
        );
        const customHeaders = uniqueHeaders
          .filter((header) => !header.isCompanyDefault)
          .map((header, index) => ({
            id: Date.now() + index,
            label: header.label,
            value: "",
            isDefault: false,
            key: header.key,
            isCompanyDefault: header.isCompanyDefault,
            isIndustryDefault: header.isIndustryDefault,
            _id: header._id,
          }));
        setDefaultFields(defaultHeaders);
        setCustomFields(customHeaders);
      }
    }

    if (data.tableHeader) {
      const cleanTableHeader = data.tableHeader
        .filter((col) => col && col.displayName && col.key)
        .map((col) => ({
          label: capitalizeFirstLetter(col.displayName.trim()),
          key: col.key,
          isCompanyDefault: col.isCompanyDefault ?? false,
          isIndustryDefault: col.isIndustryDefault ?? false,
          _id: col._id,
        }));

      const uniqueTableHeaders = cleanTableHeader.reduce((acc, current) => {
        const existingIndex = acc.findIndex((item) => item.key === current.key);
        if (existingIndex === -1) {
          acc.push(current);
        } else {
          if (
            current.isCompanyDefault &&
            !acc[existingIndex].isCompanyDefault
          ) {
            acc[existingIndex] = current;
          }
        }
        return acc;
      }, []);

      const defaultCols = uniqueTableHeaders
        .filter((col) => col.isCompanyDefault)
        .map((col) => ({
          label: col.label,
          key: col.key,
          isDefault: true,
          isCompanyDefault: col.isCompanyDefault,
          isIndustryDefault: col.isIndustryDefault,
        }));
      const customCols = uniqueTableHeaders
        .filter((col) => !col.isCompanyDefault)
        .map((col) => ({
          label: col.label,
          key: col.key,
          isDefault: false,
          isCompanyDefault: col.isCompanyDefault,
          isIndustryDefault: col.isIndustryDefault,
        }));
      setColumns([...defaultCols, ...customCols]);
      setDefaultColumns(defaultCols);
    }

    if (data.productCategory) {
      const loadedCategories = Object.keys(data.productCategory || {});
      setCategories(loadedCategories);

      const categoryData = loadedCategories.map((categoryName, index) => {
        const categoryFields = (data.productCategory[categoryName] || [])
          .filter((field) => field && field.displayName && field.key)
          .map((field) => ({
            label: capitalizeFirstLetter(field.displayName.trim()),
            key: field.key,
            isCompanyDefault: field.isCompanyDefault,
            isIndustryDefault: field.isIndustryDefault,
            _id: field._id,
          }));

        const uniqueCategoryFields = categoryFields.reduce((acc, current) => {
          const existingIndex = acc.findIndex(
            (item) => item.key === current.key
          );
          if (existingIndex === -1) {
            acc.push(current);
          } else {
            if (
              current.isCompanyDefault &&
              !acc[existingIndex].isCompanyDefault
            ) {
              acc[existingIndex] = current;
            }
          }
          return acc;
        }, []);

        const fields = uniqueCategoryFields.map((field, fieldIndex) => ({
          id: `f${Date.now()}_${fieldIndex}_${index}`,
          label: field.label,
          value: "",
          isDefault: field.isCompanyDefault,
          key: field.key,
          isCompanyDefault: field.isCompanyDefault,
          isIndustryDefault: field.isIndustryDefault,
          _id: field._id,
        }));

        return {
          id: Date.now() + Math.random() + index,
          categoryName,
          isDefault: fields.some((f) => f.isCompanyDefault),
          expanded: false,
          fields,
        };
      });
      setCategoryFields(categoryData);
      if (isDefault) {
        setDefaultCategoryFields(categoryData.filter((cat) => cat.isDefault));
      }
    }
  };

  const fetchPartnerData = async (customerCode) => {
    if (!customerCode) {
      setCompanyDetails((prev) => ({
        ...prev,
        clientName: "",
        city: "",
        contactPerson: "",
        companyName: "",
        customerAddress: "",
      }));
      return;
    }

    try {
      setIsFetching(true);
      setApiError(null);
      const response = await api.get(`/partners/customerCode/${customerCode}`);
      if (response.data) {
        const {
          clientName,
          city,
          contactPerson,
          address1,
          address2,
          address3,
        } = response.data;
        const addressParts = [address1, address2, address3].filter(Boolean);
        const combinedAddress =
          addressParts.length > 0 ? addressParts.join(", ") : "";

        setCompanyDetails((prev) => ({
          ...prev,
          clientName: clientName || "",
          contactPerson: contactPerson || "",
          companyName: clientName || "",
          city: city || "",
          customerAddress: combinedAddress,
        }));
      } else {
        throw new Error("No partner data found");
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch partner data";
      setApiError(errorMessage);
      showToast.error(`Failed to fetch partner data: ${errorMessage}`, {
        duration: 3000,
      });
      setCompanyDetails((prev) => ({
        ...prev,
        clientName: "",
        contactPerson: "",
        companyName: "",
        city: "",
        customerAddress: "",
      }));
    } finally {
      setIsFetching(false);
    }
  };

  const fetchMasterDataById = async (categoryId) => {
    try {
      setIsFetching(true);
      setApiError(null);
      const response = await api.get(`/master-data/${categoryId}`);
      if (response.data) {
        return response.data;
      } else {
        throw new Error("No master data found for the given ID");
      }
    } catch (error) {
      console.error("Error fetching master data by ID:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch master data by ID";
      setApiError(errorMessage);
      showToast.error(`Failed to fetch master data by ID: ${errorMessage}`);
      return null;
    } finally {
      setIsFetching(false);
    }
  };

  const calculateTotalAmount = (quantity, ratePerUnit, gst) => {
    const qty = parseFloat(quantity) || 0;
    const rate = parseFloat(ratePerUnit) || 0;
    const tax = parseFloat(gst) || 0;
    return (qty * rate * (1 + tax / 100)).toFixed(2);
  };

  const handleTableDataChange = (rowIndex, colIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][`col_${colIndex}`] = value;
    const quantityIndex = columns.findIndex(
      (col) => col.key.toLowerCase() === "quantity"
    );
    const ratePerUnitIndex = columns.findIndex(
      (col) => col.key.toLowerCase() === "rateperunit"
    );
    const gstIndex = columns.findIndex((col) =>
      ["gst%", "gst"].includes(col.key.toLowerCase())
    );
    const totalAmountIndex = columns.findIndex(
      (col) => col.key.toLowerCase() === "totalamount"
    );
    if (
      colIndex === quantityIndex ||
      colIndex === ratePerUnitIndex ||
      colIndex === gstIndex
    ) {
      const quantity =
        updatedTableData[rowIndex][`col_${quantityIndex}`] || "0";
      const ratePerUnit =
        updatedTableData[rowIndex][`col_${ratePerUnitIndex}`] || "0";
      const gst = updatedTableData[rowIndex][`col_${gstIndex}`] || "0";

      if (totalAmountIndex !== -1) {
        updatedTableData[rowIndex][`col_${totalAmountIndex}`] =
          calculateTotalAmount(quantity, ratePerUnit, gst);
      }
    }

    setTableData(updatedTableData);
  };

  const addTableRow = () => {
    setTableData((prev) => {
      const newId =
        prev.length > 0 ? Math.max(...prev.map((row) => row.id)) + 1 : 1;
      setNewRowId(newId);
      return [...prev, { id: newId, ...getDefaultRowData(columns) }];
    });
  };

  const handleProductCategoryChange = (rowIndex, colIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][`col_${colIndex}`] = value;
    setTableData(updatedTableData);

    const allSelectedCategories = [
      ...new Set(
        tableData.map((row, idx) =>
          idx === rowIndex
            ? value
            : row[
                `col_${columns.findIndex(
                  (col) => col.key.toLowerCase() === "productcategory"
                )}`
              ]
        )
      ),
    ].filter((cat) => cat && categories.includes(cat));
    setSelectedCategories(allSelectedCategories);

    if (
      value &&
      categories.includes(value) &&
      tableData[rowIndex].id === newRowId
    ) {
      const templateCategoryFields = data.productCategory[value] || [];
      const newCategoryTab = {
        id: Date.now() + Math.random(),
        categoryName: value,
        isDefault: templateCategoryFields.some((f) => f.isCompanyDefault),
        expanded: true, // Expand immediately on selection
        fields: templateCategoryFields
          .filter((field) => field && field.displayName && field.key)
          .map((field, index) => ({
            id: `f${Date.now()}_${index}_${Math.random()}`,
            label: capitalizeFirstLetter(field.displayName.trim()),
            value: "",
            isDefault: field.isCompanyDefault,
            key: field.key,
            isCompanyDefault: field.isCompanyDefault,
            isIndustryDefault: field.isIndustryDefault,
            _id: field._id,
          })),
      };
      setCategoryFields((prev) => [...prev, newCategoryTab]);
      setNewRowId(null);
    }
  };

  const saveToAPI = async () => {
    const validationErrors = [];
    if (!companyDetails.customerCode) {
      validationErrors.push("Customer Code is required");
    }
    if (!companyDetails.date) {
      validationErrors.push("PI Date is required");
    }
    const selectedPartner = partners.find(
      (p) => p.customerCode === companyDetails.customerCode
    );
    if (!selectedPartner) {
      validationErrors.push(
        `Selected Customer Code "${companyDetails.customerCode}" is invalid or not found in partners`
      );
    }
    if (validationErrors.length > 0) {
      showToast.error(validationErrors.join("; "));
      return;
    }

    if (selectedCategories.length === 0 || categoryFields.length === 0) {
      showToast.error("Please select at least one category");
      return;
    }
    const hasValidCategories = categoryFields.some(
      (category) => category.categoryName && category.fields.length > 0
    );

    if (!hasValidCategories) {
      showToast.error(
        "Please ensure selected categories have proper configuration"
      );
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const requiredFields = [
        "articleName",
        "hsnCode",
        "gst",
        "ratePerUnit",
        "uom",
      ];

      const items = tableData.map((row, rowIndex) => {
        const item = {
          articleName: "",
          hsnCode: "",
          gst: "",
          ratePerUnit: "",
          uom: "",
        };

        columns.forEach((col, colIndex) => {
          if (!col.key) {
            console.warn(
              `Skipping column at index ${colIndex} due to missing key:`,
              col
            );
            return;
          }
          const key = col.key.toLowerCase();
          if (key === "articlename")
            item.articleName = row[`col_${colIndex}`] || "";
          else if (key === "hsncode")
            item.hsnCode = row[`col_${colIndex}`] || "";
          else if (key === "gst%" || key === "gst")
            item.gst = row[`col_${colIndex}`] || "";
          else if (key === "rateperunit")
            item.ratePerUnit = row[`col_${colIndex}`] || "";
          else if (key === "uom") item.uom = row[`col_${colIndex}`] || "";
          else item[col.key] = row[`col_${colIndex}`] || "";
        });

        const rowCategory =
          row[
            `col_${columns.findIndex(
              (col) => col.key.toLowerCase() === "productcategory"
            )}`
          ];
        if (rowCategory) {
          const matchingCategoryTabs = categoryFields.filter(
            (cat) => cat.categoryName === rowCategory
          );
          if (matchingCategoryTabs.length > 0) {
            const category =
              matchingCategoryTabs[rowIndex % matchingCategoryTabs.length] ||
              matchingCategoryTabs[0];
            item.productCategory = category.categoryName;
            category.fields.forEach((field) => {
              if (!field.key) {
                console.warn(
                  `Skipping category field due to missing key:`,
                  field
                );
                return;
              }
              item[field.key] = field.value || "";
            });
          }
        }

        if (item.uom) {
          item.unit = item.uom;
        }

        if (item.quantity) {
          item.quantity = parseFloat(item.quantity) || 0;
        }
        if (item.ratePerUnit) {
          item.ratePerUnit = parseFloat(item.ratePerUnit) || 0;
        }
        if (item.totalAmount) {
          item.totalAmount = parseFloat(item.totalAmount) || 0;
        }

        if (editMode && row._id) {
          item._id = row._id;
        }

        return item;
      });

      const invalidItems = items
        .map((item, index) => ({
          index,
          missingFields: requiredFields.filter(
            (field) => !item[field] || item[field] === ""
          ),
        }))
        .filter((item) => item.missingFields.length > 0);

      if (invalidItems.length > 0) {
        const errorMessage = invalidItems
          .map(
            ({ index, missingFields }) =>
              `Item ${index + 1}: Missing required fields: ${missingFields.join(
                ", "
              )}`
          )
          .join("; ");
        showToast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      const uniqueCustomFields = {};
      customFields.forEach((field) => {
        if (!uniqueCustomFields[field.key]) {
          uniqueCustomFields[field.key] = field.value;
        }
      });

      const requestBody = {
        customerCode: companyDetails.customerCode,
        piDate: companyDetails.date,
        companyName: companyDetails.companyName,
        reference: companyDetails.reference,
        piNumber: companyDetails.piNumber,
        companyCode: companyDetails.companyCode || "",
        items,
        termsAndConditions: editorValue,
        customerAddress: companyDetails.customerAddress,
        remark: companyDetails.remark,
        ...Object.fromEntries(
          Object.entries(companyDetails).filter(
            ([key]) =>
              ![
                "date",
                "companyName",
                "customerName",
                "name",
                "city",
                "reference",
                "customerCode",
                "piNumber",
                "contactPerson",
                "companyCode",
                "customerAddress",
                "remark",
              ].includes(key)
          )
        ),
        ...uniqueCustomFields,
      };

      let response;
      if (editMode && id) {
        response = await api.put(`/pi/${id}`, requestBody);
        showToast.success("Proforma invoice updated successfully!", {
          duration: 2000,
        });
      } else {
        response = await api.post("/pi", requestBody);
        showToast.success("Proforma invoice saved successfully!", {
          duration: 2000,
        });
      }

      const updatedResponse = await api.get(
        `/pi/${editMode && id ? id : response.data._id}`
      );
      let updatedPiData;
      if (
        updatedResponse.data &&
        updatedResponse.data.data &&
        Array.isArray(updatedResponse.data.data)
      ) {
        updatedPiData = updatedResponse.data.data[0];
      } else if (updatedResponse.data && !updatedResponse.data.data) {
        updatedPiData = updatedResponse.data;
      } else {
        throw new Error("Unexpected updated API response structure");
      }

      if (updatedPiData) {
        const updatedAdditionalHeaders = {};
        Object.keys(updatedPiData).forEach((key) => {
          if (!reservedKeys.includes(key)) {
            updatedAdditionalHeaders[key] = updatedPiData[key] || "";
          }
        });
        const uniqueUpdatedAdditionalHeaders = Object.fromEntries(
          Object.entries(updatedAdditionalHeaders).filter(
            ([key], index, self) =>
              index === self.findIndex((item) => item[0] === key)
          )
        );

        const addressParts = [
          updatedPiData.partner?.address1,
          updatedPiData.partner?.address2,
          updatedPiData.partner?.address3,
        ].filter(Boolean);
        const combinedAddress =
          addressParts.length > 0 ? addressParts.join(", ") : "";

        setCompanyDetails({
          date: updatedPiData.piDate
            ? updatedPiData.piDate.split("T")[0]
            : today,
          companyName: updatedPiData.companyName || "",
          clientName:
            updatedPiData.partner?.clientName || updatedPiData.clientName || "",
          city: updatedPiData.partner?.city || updatedPiData.city || "",
          reference: updatedPiData.reference || "",
          customerCode:
            updatedPiData.customerCode ||
            updatedPiData.partner?.customerCode ||
            "",
          piNumber: updatedPiData.piNumber || "",
          contactPerson:
            updatedPiData.partner?.contactPerson ||
            updatedPiData.contactPerson ||
            "",
          companyCode: updatedPiData.companyCode || "",
          customerAddress: combinedAddress,
          remark: updatedPiData.remark || "",
          ...uniqueUpdatedAdditionalHeaders,
        });

        const mergedFields = mergeCustomFields([], {
          ...uniqueUpdatedAdditionalHeaders,
        });
        setCustomFields(mergedFields);
        if (updatedPiData.termsAndConditions) {
          setEditorValue(updatedPiData.termsAndConditions);
        }

        if (updatedPiData.items && updatedPiData.items.length > 0) {
          const newCategoryFields = updatedPiData.items.map((item, index) => {
            const categoryName = item.productCategory;
            const templateCategoryFields =
              data.productCategory?.[categoryName] || [];
            const fields = templateCategoryFields
              .filter((field) => field && field.displayName && field.key)
              .map((field, fieldIndex) => ({
                id: `f${Date.now()}_${fieldIndex}_${index}`,
                label: capitalizeFirstLetter(field.displayName.trim()),
                value: item[field.key] || "",
                isDefault: field.isCompanyDefault,
                key: field.key,
                isCompanyDefault: field.isCompanyDefault,
                isIndustryDefault: field.isIndustryDefault,
              }));
            return {
              id: Date.now() + Math.random() + index,
              categoryName,
              isDefault: fields.some((f) => f.isCompanyDefault),
              expanded: false,
              fields,
            };
          });
          setCategoryFields(newCategoryFields);
          setSelectedCategories([
            ...new Set(updatedPiData.items.map((item) => item.productCategory)),
          ]);

          const mappedTableData = updatedPiData.items.map((item, index) => {
            const row = { id: index + 1, _id: item._id };
            columns.forEach((col, colIndex) => {
              const key = col.key.toLowerCase();
              if (key === "productcategory") {
                row[`col_${colIndex}`] = item.productCategory || "";
              } else if (key === "articlename") {
                row[`col_${colIndex}`] = item.articleName || "";
              } else if (key === "hsncode") {
                row[`col_${colIndex}`] = item.hsnCode || "";
              } else if (key === "rateperunit") {
                row[`col_${colIndex}`] = item.ratePerUnit || "";
              } else if (key === "gst%" || key === "gst") {
                row[`col_${colIndex}`] = item.gst || "";
              } else if (key === "totalamount") {
                row[`col_${colIndex}`] =
                  item.totalAmount ||
                  calculateTotalAmount(
                    item.quantity || "0",
                    item.ratePerUnit || "0",
                    item.gst || "0"
                  );
              } else if (key === "uom") {
                row[`col_${colIndex}`] = item.uom || "";
              } else {
                row[`col_${colIndex}`] = item[col.key] || "";
              }
            });
            return row;
          });
          setTableData(mappedTableData);
        }
      }

      if (onSave && typeof onSave === "function") {
        onSave(updatedPiData, editMode);
      }
    } catch (error) {
      console.error("Error saving data to /pi:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save proforma invoice";
      setApiError(errorMessage);
      showToast.error(`Failed to save proforma invoice: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyDetailChange = (field, value) => {
    if (["date", "piNumber"].includes(field)) return;
    setCompanyDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCustomFields((prev) => {
      const existingFieldIndex = prev.findIndex((cf) => cf.key === field);
      if (existingFieldIndex !== -1) {
        return prev.map((cf, index) =>
          index === existingFieldIndex ? { ...cf, value } : cf
        );
      } else if (!reservedKeys.includes(field)) {
        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            label: capitalizeFirstLetter(field),
            value,
            isDefault: false,
            key: field,
            isCompanyDefault: false,
            isIndustryDefault: false,
          },
        ];
      }
      return prev;
    });
    if (field === "customerCode") {
      fetchPartnerData(value);
    }
  };

  const updateCustomField = (id, key, val) => {
    setCustomFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, [key]: val } : field))
    );
  };

  const toggleCategory = (categoryId) => {
    setCategoryFields((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, expanded: !category.expanded }
          : category
      )
    );
  };

  const handleFieldValueChange = (categoryId, fieldId, value) => {
    setCategoryFields((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const updatedFields = category.fields.map((field) =>
            field.id === fieldId ? { ...field, value } : field
          );
          return { ...category, fields: updatedFields };
        }
        return category;
      })
    );
  };

  const isPublishDisabled =
    isLoading ||
    isFetching ||
    !companyDetails.customerCode ||
    !companyDetails.date;

  const articleNameColumnIndex = columns.findIndex(
    (col) => col.key.toLowerCase() === "articlename"
  );

  const renderCustomFields = [
    ...new Map(customFields.map((field) => [field.key, field])).values(),
  ].filter(
    (field) => field.key !== "customerAddress" && field.key !== "remark"
  );

  return (
    <div className="bg-gray-50 p-4">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2b86aa;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1b6a8c;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #2b86aa #f1f5f9;
        }
        .dropdown-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .dropdown-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 2px;
        }
        .dropdown-scrollbar::-webkit-scrollbar-thumb {
          background: #2b86aa;
          border-radius: 2px;
        }
        .dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1b6a8c;
        }
        .dropdown-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #2b86aa #e5e7eb;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="bg-[linear-gradient(346.16deg,#2B86AA_42.92%,#69B9D9_139.13%)] border border-[#ABE7FF] text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/30">
            <h1 className="text-md font-regular">PI Creation</h1>
            <div className="text-sm font-regular">
              Date: {companyDetails.date}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="bg-white text-[#171A1F] px-6 py-3 rounded-lg shadow-sm">
              <div className="text-sm font-bold">LOGO Image</div>
            </div>
            <div className="flex-1 text-center mx-8">
              <div className="text-base font-regular">
                {company?.companyName}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-regular">
                {combinedCompanyAddress}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-7xl mx-auto font-sans py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 py-2 gap-4">
            {defaultFields.map((field, index) => (
              <div
                key={`default-${index}`}
                className={`relative flex flex-col ${
                  field.label === "Customer Address"
                    ? "lg:col-span-8"
                    : field.label === "Contact Person"
                    ? "lg:col-span-4"
                    : "lg:col-span-4"
                }`}
              >
                <label className="text-xs mb-1 h-6 flex items-center">
                  <span
                    className={`font-regular text-[#171A1F] text-sm py-1.5 rounded`}
                  >
                    {field.label}
                  </span>
                </label>
                {field.key === "customerCode" ? (
                  <select
                    value={companyDetails.customerCode || ""}
                    onChange={(e) =>
                      handleCompanyDetailChange(field.key, e.target.value)
                    }
                    className="border border-[#B3E2FF] text-[#171A1F] rounded px-2 py-1.5 text-sm shadow-inner focus:outline-none bg-gray-50"
                    required
                    disabled={isFetching}
                  >
                    <option value="" disabled>
                      Select Customer Code
                    </option>
                    {isFetching ? (
                      <option value="" disabled>
                        Loading partners...
                      </option>
                    ) : partners.length === 0 ? (
                      <option value="" disabled>
                        No partners available
                      </option>
                    ) : (
                      partners.map((partner) => (
                        <option
                          key={partner.customerCode}
                          value={partner.customerCode}
                        >
                          {partner.customerCode}
                        </option>
                      ))
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={companyDetails[field.key] || ""}
                    onChange={(e) =>
                      handleCompanyDetailChange(field.key, e.target.value)
                    }
                    readOnly={[
                      "date",
                      "piNumber",
                      "clientName",
                      "contactPerson",
                      "customerAddress",
                    ].includes(field.key)}
                    className={`border rounded px-2 py-1.5 text-sm shadow-inner text-[#171A1F] focus:outline-none ${
                      field.key === "piNumber"
                        ? "bg-[#FFEAB0] border-[#E7BD00]"
                        : "border-[#B3E2FF] bg-gray-50"
                    } ${
                      [
                        "date",
                        "piNumber",
                        "clientName",
                        "contactPerson",
                        "customerAddress",
                      ].includes(field.key)
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                    required={["customerCode"].includes(field.key)}
                  />
                )}
              </div>
            ))}
            {renderCustomFields.map((field) => (
              <div
                key={field.id}
                className={`relative flex flex-col ${
                  field.label === "Customer Address"
                    ? "lg:col-span-8"
                    : "lg:col-span-4"
                } `}
              >
                <label className="text-xs mb-1 h-6 flex items-center">
                  <span className="font-regular text-[#171A1F] text-sm px-2 py-1.5 rounded">
                    {field.label}
                  </span>
                </label>
                <input
                  type="text"
                  value={companyDetails[field.key] || field.value || ""}
                  onChange={(e) =>
                    handleCompanyDetailChange(field.key, e.target.value)
                  }
                  className="border border-[#B3E2FF] rounded px-2 py-1.5 text-sm text-[#171A1F] shadow-inner focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white mt-4 rounded-lg shadow-sm border border-gray-200 relative">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-white border-b-2 border-blue-200">
                  <th className="w-6 px-0 py-1 border-r text-xs font-medium text-gray-700 text-center border-blue-200 bg-white">
                    S.No
                  </th>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      className="relative px-0 py-2 border-r border-blue-200 bg-white whitespace-nowrap"
                      style={{
                        width:
                          col.label.length < 4
                            ? "40px"
                            : col.label.length < 8
                            ? "60px"
                            : col.label.length < 15
                            ? "80px"
                            : "100px",
                        minWidth:
                          col.label.length < 4
                            ? "40px"
                            : col.label.length < 8
                            ? "60px"
                            : col.label.length < 15
                            ? "80px"
                            : "100px",
                      }}
                    >
                      <div className="relative">
                        <span className="text-xs font-medium text-gray-700 text-center">
                          {col.label || ""}
                          {[
                            "articlename",
                            "hsncode",
                            "gst%",
                            "rateperunit",
                            "uom",
                          ].includes(col.key.toLowerCase())}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-blue-200 hover:bg-blue-25"
                  >
                    <td className="py-1 border-r border-blue-200 text-center font-medium text-gray-700 bg-blue-25 text-xs">
                      {row.id}.
                    </td>
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="py-1 border-r border-blue-200"
                        style={{
                          width:
                            col.label.length < 4
                              ? "40px"
                              : col.label.length < 8
                              ? "60px"
                              : col.label.length < 15
                              ? "80px"
                              : "100px",
                        }}
                      >
                        {col.key.toLowerCase() === "productcategory" ? (
                          <select
                            value={row[`col_${colIndex}`] || ""}
                            onChange={(e) =>
                              handleProductCategoryChange(
                                rowIndex,
                                colIndex,
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent outline-none text-center text-xs focus:bg-blue-50 rounded px-0"
                          >
                            <option value="" disabled>
                              Select Category
                            </option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        ) : col.key.toLowerCase() === "totalamount" ? (
                          <input
                            type="text"
                            value={row[`col_${colIndex}`] || ""}
                            readOnly
                            className="w-full bg-transparent outline-none text-center text-xs focus:bg-blue-50 rounded px-0 cursor-not-allowed"
                          />
                        ) : (
                          <input
                            type="text"
                            value={row[`col_${colIndex}`] || ""}
                            onChange={(e) =>
                              handleTableDataChange(
                                rowIndex,
                                colIndex,
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent outline-none text-center text-xs focus:bg-blue-50 rounded px-0"
                            required={[
                              "articlename",
                              "hsncode",
                              "gst%",
                              "rateperunit",
                              "uom",
                            ].includes(col.key.toLowerCase())}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end p-2">
            <button
              onClick={addTableRow}
              className="bg-[#2B86AA] hover:bg-[#227499] text-white px-4 py-1 rounded-md shadow-sm text-xs"
            >
              Add Row
            </button>
          </div>
        </div>
        {categoryFields.map((category, catIndex) => {
          const productCategoryColumnIndex = columns.findIndex(
            (col) => col.key.toLowerCase() === "productcategory"
          );
          const matchingRowIndex = tableData.findIndex(
            (row, index) =>
              row[`col_${productCategoryColumnIndex}`] ===
                category.categoryName &&
              index %
                categoryFields.filter(
                  (c) => c.categoryName === category.categoryName
                ).length ===
                catIndex
          );
          if (matchingRowIndex === -1) return null;
          const articleName =
            matchingRowIndex !== -1 && articleNameColumnIndex !== -1
              ? tableData[matchingRowIndex][`col_${articleNameColumnIndex}`] ||
                ""
              : "";

          return (
            <div
              key={category.id}
              className="border border-gray-200 rounded-md mt-3 overflow-hidden"
            >
              <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div
                  className="flex items-center flex-1 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="text-gray-800 mr-2 font-semibold text-[#2B86AA] text-sm">
                    {category.categoryName}
                  </span>
                  <span className="text-[#565E6C] font-medium text-sm mx-2">
                    |
                  </span>
                  <span className="text-gray-800 ml-2 font-semibold text-[#2B86AA] text-sm">
                    {articleName || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="cursor-pointer p-1"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.expanded ? (
                      <ChevronUp size={16} className="text-gray-600" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-600" />
                    )}
                  </div>
                </div>
              </div>

              {category.expanded && (
                <div className="p-6 bg-gray-50 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.fields.map((field) => (
                      <div key={field.id} className="relative">
                        <div className="bg-white p-4 transition-shadow duration-200">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-regular text-gray-600 flex-1 rounded px-2 py-0.5 cursor-default">
                              {field.label || "Enter Label"}
                            </label>
                          </div>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) =>
                              handleFieldValueChange(
                                category.id,
                                field.id,
                                e.target.value
                              )
                            }
                            className="w-full border border-[#B3E2FF] rounded-md px-2 py-1 text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div className="mt-6 mb-3 ">
          <label className="block text-sm font-medium px-2 text-black mb-2">
            Add Note Here :
          </label>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <ReactQuill
              value={editorValue}
              onChange={setEditorValue}
              modules={modules}
              formats={formats}
              className="h-64 pb-16"
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4 my-6">
          <button
            onClick={saveToAPI}
            disabled={isPublishDisabled}
            className={`px-8 py-2 rounded-md shadow-sm text-white ${
              isPublishDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2B86AA] hover:bg-[#227499]"
            }`}
          >
            {isLoading ? "Saving..." : editMode ? "Update" : "Publish"}
          </button>
          <button
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-md shadow-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

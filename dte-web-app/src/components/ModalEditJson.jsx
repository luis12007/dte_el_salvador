import React, { useState } from "react";
import Modal from "react-modal";

const ModalEditJson = ({ isOpen, onRequestClose, jsonData, onSave }) => {
  const [editData, setEditData] = useState(jsonData || {});

  React.useEffect(() => {
    setEditData(jsonData || {});
  }, [jsonData]);

  const handleChange = (path, value) => {
    setEditData((prev) => {
      const newData = { ...prev };
      let ref = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!ref[path[i]]) ref[path[i]] = {};
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return { ...newData };
    });
  };

  // Render editable fields for a given object
  const renderFields = (obj, path = []) => {
    return Object.entries(obj || {}).map(([key, value]) => {
      const currentPath = [...path, key];
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return (
          <div key={currentPath.join(".")}
            className="ml-4 border-l-2 border-gray-200 pl-2 mb-2">
            <div className="font-semibold text-gray-700 mb-1">{key}:</div>
            {renderFields(value, currentPath)}
          </div>
        );
      } else if (Array.isArray(value)) {
        return (
          <div key={currentPath.join(".")}
            className="ml-4 border-l-2 border-gray-200 pl-2 mb-2">
            <div className="font-semibold text-gray-700 mb-1">{key} (array):</div>
            {value.map((item, idx) => (
              <div key={idx} className="ml-4">
                {typeof item === "object" ? renderFields(item, [...currentPath, idx]) : (
                  <input
                    className="border px-2 py-1 rounded w-full mb-1"
                    value={item}
                    onChange={e => handleChange([...currentPath, idx], e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div key={currentPath.join(".")} className="mb-2 flex items-center gap-2">
            <label className="w-40 text-gray-600 font-medium">{key}:</label>
            <input
              className="border px-2 py-1 rounded w-full"
              value={value == null ? "" : value}
              onChange={e => handleChange(currentPath, e.target.value)}
            />
          </div>
        );
      }
    });
  };

  const handleSave = () => {
    onSave(editData);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar JSON"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 animate-zoomIn p-6">
        <h2 className="text-xl font-bold mb-4">Editar Información del JSON</h2>
        <div className="max-h-96 overflow-y-auto mb-4">
          {renderFields(editData)}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditJson;

import React, { useState } from 'react';
import Modal from 'react-modal';
import HamburguerComponent from './HamburguerComponent';
import SidebarComponent from '../components/SideBarComponent';

const BooksComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visible, setVisible] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDownload = () => {
    // Implement download logic here
    console.log('Download clicked with dates:', startDate, endDate);
    closeModal();
  };

  const sidebar = () => {
    setVisible(!visible);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-steelblue-300">
      <HamburguerComponent sidebar={sidebar} visible={visible} />
      <SidebarComponent visible={visible} setVisible={setVisible}  />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          
          <h2 className="text-lg font-bold mb-2">Libros de Comprobante de Crédito Fiscal más Anexos</h2>
          <button onClick={openModal} className="bg-blue-500  text-white px-4 py-2 rounded">Open</button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Libros de Consumidor Final más Anexos</h2>
          <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded">Open</button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Libros de Compras más Anexos</h2>
          <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded">Open</button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-bold mb-2">Libro de Ventas más Anexos</h2>
          <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded">Open</button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Select Dates"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-lg font-bold mb-4">Select Dates</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
            <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">Download</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BooksComponent;
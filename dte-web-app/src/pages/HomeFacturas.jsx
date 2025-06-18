import React, { useState, useEffect } from "react";
import FacturaUnSend from "../components/FacturaUnSend";
import FacturaSend from "../components/FacturaSend";
import HamburguerComponent from "../components/HamburguerComponent";
import SidebarComponent from "../components/SideBarComponent";
import PlantillaAPI from "../services/PlantillaService";
import UserService from "../services/UserServices";
import LoginAPI from "../services/Loginservices";
import * as XLSX from "xlsx";
import filterimg from "../assets/imgs/filter.png";
import filterwhite from "../assets/imgs/filterwhite.png";
import FilterModal from "../components/FilterModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from 'exceljs';

const HomeFacturas = () => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const [items, setItems] = useState([]);
  const tokenminis = localStorage.getItem("tokenminis");
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterByc, setFilterBy] = useState('');
    const [isLoading, setIsLoading] = useState(true);
  

  // Sidebar visibility toggle
  const [visible, setVisible] = useState(true);
  const toggleSidebar = () => {
    setVisible(!visible);
  };

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* Change to login maybe */
        const resultusers = await UserService.getUserInfo(user_id, token);
        setUser(resultusers);
        const result = await PlantillaAPI.getByUserId(user_id, token);
        console.log("result");
        console.log(result);
        /* organize the results by fecha_y_hora_de_generacion desc*/
        result.sort((a, b) => {
          return new Date(b.fecha_y_hora_de_generacion) - new Date(a.fecha_y_hora_de_generacion);
        });
        setItems(result || []); // Default to empty array

        if (result !== null || result.length) {
        setLoading(false);
        setIsLoading(false);
        
        }
        if (tokenminis === "undefined" || tokenminis === null) {
          const resultAuthminis = await LoginAPI.loginMinis(
            resultusers.nit,
            resultusers.codigo_hacienda,
            "MysoftwareSv"
          );
          console.log(resultAuthminis);
          localStorage.setItem("tokenminis", resultAuthminis.body.token.slice(7));
          /* reload */
          window.location.reload();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function

  }, []); // Ensure this runs only once on mount

  const findFirstAndMostRecentDate = (items) => {
    if (!items.length) {
      return { firstDate: null, mostRecentDate: null };
    }
  
    return items.reduce((acc, item) => {
      const date = new Date(item.fecha_y_hora_de_generacion);
      const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  
      if (!acc.firstDate || utcDate < acc.firstDate) {
        acc.firstDate = utcDate;
      }
      if (!acc.mostRecentDate || utcDate > acc.mostRecentDate) {
        acc.mostRecentDate = utcDate;
      }
      return acc;
    }, { firstDate: new Date(new Date(items[0].fecha_y_hora_de_generacion).getTime() + new Date(items[0].fecha_y_hora_de_generacion).getTimezoneOffset() * 60000), mostRecentDate: new Date(new Date(items[0].fecha_y_hora_de_generacion).getTime() + new Date(items[0].fecha_y_hora_de_generacion).getTimezoneOffset() * 60000) });
  };
  
  const formatDateToLetters = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };
  


  const excelHandler = async () => {
    if (!items.length) {
      toast.info("No se encontraron datos para el rango de fechas seleccionado - Facturas");
      return;
    }
    console.log('Exporting to Excel...');
    console.log(items)

    const transformedData = items.map((item, index) => ({
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'NÚMERO DE CORRELATIVO PREEIMPRESO': item.codigo_de_generacion,
      'NOMBRE EMISOR': user.name,
      'DOCUMENTO EMISOR': user.nit,
      'NOMBRE DEL CLIENTE MANDANTE O MANDATARIO': item.re_name,
      'DOCUMENTO DEL CLIENTE': item.re_nit ? item.re_nit : item.re_numdocumento,
      'VENTAS EXENTAS': item.totalexenta || 0,
      'VENTAS INTERNAS GRAVADAS': item.total_agravada || 0,
      'IVA PERCIBIDO': item.tributocf ? item.tributocf.split('|')[2] : item.iva_percibido,
      'RETENCION': item.retencion_de_renta || 0,
      'TOTAL': item.total_a_pagar
    }));

    const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Facturas');
    const { firstDate, mostRecentDate } = findFirstAndMostRecentDate(items);

        // Add header rows
        const headerRows = [
          ['Reporte de facturas'],
          [`${user.name}`],
          [`Fecha del ${formatDateToLetters(firstDate)} al ${formatDateToLetters(mostRecentDate)}`],
          [''], // Empty row for spacing
        ];

        // Add and style each header row
    headerRows.forEach((row, index) => {
      const excelRow = worksheet.addRow(row);
      worksheet.mergeCells(`A${index + 1}:K${index + 1}`);

      // Style the merged cell
      const cell = worksheet.getCell(`A${index + 1}`);
      if (index == 0 || index == 1) {
        cell.style = {
          font: {
            bold: true,
            size: 16,
            name: 'Arial',
          },
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
          },
        };
      } else {
        cell.style = {
          font: {
            bold: false,
            size: 13,
            name: 'Arial',
          },
          alignment: {
            horizontal: 'left',
            vertical: 'middle',
            wrapText: true,
          },
        };
      }
      
      excelRow.height = index === 0 ? 30 : 25;
    });


      
    const tableHeaders = [
      `FECHA DE EMISIÓN DEL DOCUMENTO`,
      'NÚMERO DE CORRELATIVO PREEIMPRESO',
      'NOMBRE EMISOR',
      'DOCUMENTO EMISOR',
      'NOMBRE DEL CLIENTE MANDANTE O MANDATARIO',
      'DOCUMENTO DEL CLIENTE',
      'VENTAS EXENTAS',
      'VENTAS INTERNAS GRAVADAS',
      'IVA PERCIBIDO',
      'RETENCION',
      'TOTAL',
    ];

    const headerRow = worksheet.addRow(tableHeaders);

    // Style table headers
    headerRow.eachCell((cell) => {
      cell.style = {
        font: {
          bold: true,
          color: { argb: 'FFFFFFFF' },
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        },
        border: {
          top: { style: 'medium', color: { argb: 'FF000000' } },
          left: { style: 'medium', color: { argb: 'FF000000' } },
          bottom: { style: 'medium', color: { argb: 'FF000000' } },
          right: { style: 'medium', color: { argb: 'FF000000' } },
        },
      };
    });


    // Add data rows
    transformedData.forEach((rowData) => {
      const row = worksheet.addRow(Object.values(rowData));
      row.eachCell((cell) => {
        cell.style = {
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
          },
          border: {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } },
          },
        };
      });
    });

    const totals = calculateTotals(transformedData);

    // Add summary section
    const summaryRows = [ /* Total agravado */
      ['', '', '', '', '', 'TOTAL', totals.exentas, totals.agravadas, totals.iva, totals.retencion, totals.grantotal]
    ];

    // Add and style summary rows
    summaryRows.forEach((row, index) => {
      const summaryRow = worksheet.addRow(row);
      // Apply styles to cells
      summaryRow.eachCell((cell, colNumber) => {
        if (colNumber > 5) {
        let borderStyle = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };

        // Add thick border for periphery
        if (index === 0) {
          borderStyle.top.style = 'medium';
        }
        if (index === summaryRows.length - 1) {
          borderStyle.bottom.style = 'medium';
        }
        if (colNumber === 2) {
          borderStyle.left.style = 'medium';
        }
        if (colNumber === 9) {
          borderStyle.right.style = 'medium';
        }
        cell.style = {
          font: {
            bold: index === 0 || colNumber === 2,
            size: index === 0 ? 12 : 11,
          },
          alignment: {
            horizontal: index === 0 ? 'center' : (colNumber === 2 ? 'left' : (colNumber === 3 ? 'right' : 'center')),
            vertical: 'middle',
          },
          border: borderStyle
        };
      }
      });

      // Set row height
      summaryRow.height = 25;
    });

    // Set column widths for better readability
    worksheet.columns = [
      { width: 15 },
      { width: 40 },
      { width: 30 }, 
      { width: 20 },
      { width: 30 },
      { width: 20 }, 
      { width: 10 }, 
      { width: 15 },
      { width: 12 }, 
      { width: 12 }, 
      { width: 12 }, 
      { width: 15 }
    ];

    // Generate and save the file
        try {
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Reporte de Facturas - ${user.name}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
          toast.success("Reporte de Facturas creado con éxito");
        } catch (error) {
          console.error("Error generating Excel file:", error);
          toast.error("Error al crear el Reporte de Facturas");
        }
    

  };

  const calculateTotals = (data) => {
    return data.reduce((acc, row) => {
      return {
        exentas: acc.exentas + Number(row['VENTAS EXENTAS'] || 0),
        agravadas: acc.agravadas + Number((row['VENTAS INTERNAS GRAVADAS'] || 0)),
        iva: acc.iva + Number(row['IVA PERCIBIDO'] || 0),
        retencion: acc.retencion + Number(row['RETENCION'] || 0),
        grantotal: acc.grantotal + Number(row['TOTAL'] || 0),
      };
    }, {
      exentas: 0,
      agravadas: 0,
      locales: 0,
      exportaciones: 0,
      iva: 0,
      retencion: 0,
      grantotal: 0,
    });
  };

  const groupItemsByDate = (items) => {
    const grouped = items.reduce((acc, item) => {
      const date = item.fecha_y_hora_de_generacion.split(" ")[0]; // Extract the date part
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    // Sort items within each date group by time (newest first)
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        return new Date(b.fecha_y_hora_de_generacion) - new Date(a.fecha_y_hora_de_generacion);
      });
    });

    return grouped;
  };

  const groupedItems = groupItemsByDate(items);

  // Sort the grouped dates by newest first
  const sortedGroupedDates = Object.keys(groupedItems).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  /* function to transform format date in text separete by year moth and day in spanish  input 2025-01-02 output 1 de agosto de 2025*/
  const transformDate = (date) => {
    const dateArray = date.split("-");
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];
    const monthNames = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return `${day} de ${monthNames[parseInt(month) - 1]} de ${year}`;
  }

  const openModal = (event, filter) => {
    event.preventDefault();
    setFilterBy(filter);
    setIsModalVisible(true);
    setShowModal(false);

  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSearch = async (filterData) => {
    console.log('Search data:', filterData);
    setLoading(true);
    let newItems = [];

    if (!filterData || !filterData.filterByc) {
      console.error('Invalid filter data:', filterData);
      toast.info("Por favor, selecciona un tipo de filtro.");
      setLoading(false);
      return;
    }

    if (filterData.filterByc === 'date' && (!filterData.fromDate || !filterData.toDate)) {
      toast.info("Por favor, selecciona ambas fechas.");
      setLoading(false);
      return;
    }

    if ((filterData.filterByc === 'name' || filterData.filterByc === 'type') && !filterData.value) {
      toast.info("Por favor, ingresa un valor para buscar.");
      setLoading(false);
      return;
    }

    try {
      if (filterData.filterByc === 'name') {
        newItems = await PlantillaAPI.getByUserIdAndName(user_id, token, filterData.value);
      } else if (filterData.filterByc === 'date') {
        newItems = await PlantillaAPI.getByUserIdAndRange(user_id, token, filterData.fromDate, filterData.toDate);
      } else if (filterData.filterByc === 'type') {
        newItems = await PlantillaAPI.getByUserIdAndType(user_id, token, filterData.value);
      }
      
      // Sort filtered items by fecha_y_hora_de_generacion desc
      if (newItems && Array.isArray(newItems)) {
        newItems.sort((a, b) => {
          return new Date(b.fecha_y_hora_de_generacion) - new Date(a.fecha_y_hora_de_generacion);
        });
      }
      
    } catch (error) {
      console.error('Error fetching filtered items:', error);
      toast.error("Error al filtrar los datos.");
    }
    
    console.log('Filtered items:', newItems);
    setItems(newItems || []);
    setLoading(false);
  };


  const filterBy = async (event, criteria) => {
    event.preventDefault();
    setFilter(criteria);
    setShowModal(false);
    var newitems = items;
    if (criteria == "type") {
      newitems = await PlantillaAPI.getByUserIdAndType(user_id, token, "03");
    }

    if (criteria == "date") {
      newitems = await PlantillaAPI.getByUserIdAndRange(user_id, token, "2025-01-15", "2025-01-16");
    }

    if (criteria == "name") {
      newitems = await PlantillaAPI.getByUserIdAndName(user_id, token, "ju");
    }
    /* filtered items */
    console.log("----------------newitems----------------");
    console.log(newitems);
    console.log("----------------newitems----------------");

  };


  return (
    <div className="w-full min-h-screen bg-steelblue-300 flex flex-col pt-[66px] pb-[33px] pr-[22px] box-border ch:items-center">
      <SidebarComponent visible={visible} />
      <button className="animate-fadeIn bg-gray-300 w-2/12 self-end h-12 border-black rounded-lg drop-shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center" onClick={() => setShowModal(true)}>
        <img src={filterwhite} className="h-9 pl-3 self-center mr-3" alt="" />
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center animate-fadeInUp w-full max-w-sm mx-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Filtrar Por</h2>
            <button className="bg-steelblue-300 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md mb-3 sm:mb-4 text-base sm:text-lg hover:scale-105 transition-transform duration-200 w-full" onClick={(event) => openModal(event, 'name')}>
              Nombre
            </button>
            <button className="bg-steelblue-300 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md mb-3 sm:mb-4 text-base sm:text-lg hover:scale-105 transition-transform duration-200 w-full" onClick={(event) => openModal(event, 'date')}>
              Fecha
            </button>
            <button className="bg-steelblue-300 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md mb-3 sm:mb-4 text-base sm:text-lg hover:scale-105 transition-transform duration-200 w-full" onClick={(event) => openModal(event, 'type')}>
              Tipo
            </button>
            <button className="bg-lightcoral text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md text-base sm:text-lg hover:scale-105 transition-transform duration-200 w-full" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <FilterModal
        isVisible={isModalVisible}
        filterByc={filterByc}
        onClose={closeModal}
        onSearch={handleSearch}
      />


      <section className="pl-2 ch:w-1/3 animate-fadeInUp animate-delay-200">
        {loading ? (
          <div className="flex items-center justify-center my-4 rounded-lg">
            <div className="flex flex-col items-center border-8 px-3 py-2 drop-shadow-xl border-opacity-45 rounded-lg justify-center bg-slate-300 border-t border-gray-300">
              <span className="self-center mx-4 text-xl [-webkit-text-stroke:1px_#000] font-thin">Cargando...</span>
            </div>
          </div>
        ) : (
          <>
            {Array.isArray(items) && items.length > 0 ? (
              sortedGroupedDates.map((date, index) => (
                <div key={date} className="animate-slideInUp">
                  <div className="flex items-center justify-center my-4 rounded-lg">
                    <div className="flex flex-col items-center border-8 px-3 py-2 drop-shadow-xl border-opacity-45 rounded-lg justify-center bg-slate-300 border-t border-gray-300 hover:scale-105 transition-transform duration-200">
                      <span className="self-center mx-4 text-xl [-webkit-text-stroke:1px_#000] font-thin">{date}</span>
                      <div>{transformDate(date)}</div>
                    </div>
                  </div>
                  {groupedItems[date].map((content, itemIndex) => (
                    <div key={itemIndex}>
                      <FacturaUnSend content={content} user={user} />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center my-4 rounded-lg animate-fadeIn">
                <div className="flex flex-col items-center border-8 px-3 py-2 drop-shadow-xl border-opacity-45 rounded-lg justify-center bg-slate-300 border-t border-gray-300">
                  <span className="self-center mx-4 text-xl [-webkit-text-stroke:1px_#000] font-thin">No facturas para mostrar</span>
                </div>
              </div>
            )}
          </>
        )}
      </section>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}

      <button
        onClick={excelHandler}
        className="animate-fadeInUp animate-delay-300 cursor-pointer self-center mt-16 [border:none] pt-[11px] pb-[14px] pr-[49px] pl-12 bg-seagreen-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-center justify-center hover:bg-seagreen-100 hover:scale-105 transition-all duration-200"
      >
        <b className="relative self-center text-lg font-inria-sans text-white text-left z-[1]">
          Excel
        </b>
      </button>
      <ToastContainer />
      <HamburguerComponent sidebar={toggleSidebar} visible={visible} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="light"
      />
    </div>
  );
};

export default HomeFacturas;
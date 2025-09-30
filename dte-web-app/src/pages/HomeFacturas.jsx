import React, { useState, useEffect } from "react";
import FacturaUnSend from "../components/FacturaUnSend";
import FacturaSend from "../components/FacturaSend";
import HamburguerComponent from "../components/HamburguerComponent";
import SidebarComponent from "../components/SideBarComponent";
import PlantillaAPI from "../services/PlantillaService";
import UserService from "../services/UserServices";
import { useNavigate } from "react-router-dom";
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
      const navigate = useNavigate();
  

  // Sidebar visibility toggle
  const [visible, setVisible] = useState(false);
  const toggleSidebar = () => {
    setVisible(!visible);
  };

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* Change to login maybe */
        const resultusers = await UserService.getUserInfo(user_id, token);
        console.log("resultusers");
        console.log(resultusers);
    if (resultusers.payment === false) {
      toast.error("Error al procesar pago, por favor contacta a soporte!", {
                position: "top-center",
                autoClose: 3000, // Auto close after 3 seconds
                hideProgressBar: false, // Display the progress bar
                closeOnClick: true, // Close the toast when clicked
                draggable: true, // Allow dragging the toast
                style: { zIndex: 200000 } // Correct way to set z-index
              });

              /* wait 3 seconds */
                navigate("/ingresar");
            }
        setUser(resultusers);
        const result = await PlantillaAPI.getByUserId(user_id, token);
        console.log("result");
        console.log(result);
        
        /* organize the results by fecha_y_hora_de_generacion desc with better sorting */
        if (result && Array.isArray(result)) {
          result.sort((a, b) => {
            // Create full datetime for comparison
            const dateA = new Date(a.fecha_y_hora_de_generacion + 'T' + (a.horemi || '00:00:00'));
            const dateB = new Date(b.fecha_y_hora_de_generacion + 'T' + (b.horemi || '00:00:00'));
            return dateB - dateA; // Newest first
          });
        }
        
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

    // Sort items by datetime before exporting to maintain order in Excel
    const sortedItems = [...items].sort((a, b) => {
      const dateTimeA = new Date(a.fecha_y_hora_de_generacion + 'T' + (a.horemi || '00:00:00'));
      const dateTimeB = new Date(b.fecha_y_hora_de_generacion + 'T' + (b.horemi || '00:00:00'));
      return dateTimeB - dateTimeA; // Newest first
    });

    const transformedData = sortedItems.map((item, index) => ({
      'FECHA DE EMISIÓN DEL DOCUMENTO': item.fecha_y_hora_de_generacion,
      'HORA DE EMISIÓN': item.horemi || '00:00:00',
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
      worksheet.mergeCells(`A${index + 1}:L${index + 1}`); // Updated to L to include hour column

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
      'FECHA DE EMISIÓN DEL DOCUMENTO',
      'HORA DE EMISIÓN',
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

    // Add summary section (updated to account for hour column)
    const summaryRows = [
      ['', '', '', '', '', '', 'TOTAL', totals.exentas, totals.agravadas, totals.iva, totals.retencion, totals.grantotal]
    ];

    // Add and style summary rows
    summaryRows.forEach((row, index) => {
      const summaryRow = worksheet.addRow(row);
      // Apply styles to cells
      summaryRow.eachCell((cell, colNumber) => {
        if (colNumber > 6) { // Updated from 5 to 6 to account for hour column
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
        if (colNumber === 7) { // Updated from 2 to 7
          borderStyle.left.style = 'medium';
        }
        if (colNumber === 12) { // Updated from 9 to 12
          borderStyle.right.style = 'medium';
        }
        cell.style = {
          font: {
            bold: index === 0 || colNumber === 7, // Updated from 2 to 7
            size: index === 0 ? 12 : 11,
          },
          alignment: {
            horizontal: index === 0 ? 'center' : (colNumber === 7 ? 'left' : (colNumber === 8 ? 'right' : 'center')), // Updated column numbers
            vertical: 'middle',
          },
          border: borderStyle
        };
      }
      });

      // Set row height
      summaryRow.height = 25;
    });

    // Set column widths for better readability (updated to include hour column)
    worksheet.columns = [
      { width: 15 }, // Date
      { width: 12 }, // Hour
      { width: 40 }, // Correlativo
      { width: 30 }, // Emisor name
      { width: 20 }, // Emisor doc
      { width: 30 }, // Cliente name
      { width: 20 }, // Cliente doc
      { width: 10 }, // Exentas
      { width: 15 }, // Gravadas
      { width: 12 }, // IVA
      { width: 12 }, // Retención
      { width: 15 }  // Total
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

    // Sort items within each date group by full datetime (newest first)
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        // Create full datetime for precise sorting
        const dateTimeA = new Date(a.fecha_y_hora_de_generacion + 'T' + (a.horemi || '00:00:00'));
        const dateTimeB = new Date(b.fecha_y_hora_de_generacion + 'T' + (b.horemi || '00:00:00'));
        return dateTimeB - dateTimeA; // Newest first within the same date
      });
    });

    return grouped;
  };

  // Determinar si la factura más reciente global (por fecha y hora) no está sellada.
  // Sólo esa puede eliminarse; si la más reciente está sellada, ninguna se puede eliminar.
  const getDateTime = (it) => {
    try {
      return new Date(it.fecha_y_hora_de_generacion + 'T' + (it.horemi || '00:00:00')).getTime();
    } catch {
      return 0;
    }
  };
  let canDeleteId = null;
  if (Array.isArray(items) && items.length) {
    const newest = items.reduce((acc, it) => (getDateTime(it) > getDateTime(acc) ? it : acc), items[0]);
    if (newest && !newest.sellado) {
      canDeleteId = newest.codigo_de_generacion;
    }
  }

  const groupedItems = groupItemsByDate(items);

  // Sort the grouped dates by newest first with better date parsing
  const sortedGroupedDates = Object.keys(groupedItems).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB - dateA; // Newest dates first
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
      
      // Sort filtered items by fecha_y_hora_de_generacion and horemi desc
      if (newItems && Array.isArray(newItems)) {
        newItems.sort((a, b) => {
          // Create full datetime for precise sorting
          const dateTimeA = new Date(a.fecha_y_hora_de_generacion + 'T' + (a.horemi || '00:00:00'));
          const dateTimeB = new Date(b.fecha_y_hora_de_generacion + 'T' + (b.horemi || '00:00:00'));
          return dateTimeB - dateTimeA; // Newest first
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
    <div className="w-full min-h-screen bg-steelblue-300 flex flex-col pt-[66px] pb-8 box-border overflow-x-hidden">
      <SidebarComponent visible={visible} />

      {/* Top bar */}
      <div className="sticky top-[66px] z-20 w-full bg-steelblue-300 text-white shadow-md">
        <div className="mx-auto max-w-6xl px-3 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Facturas</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition"
              onClick={() => setShowModal(true)}
              title="Filtrar"
            >
              <img src={filterwhite} className="h-5 w-5" alt="Filtrar" />
              <span className="text-sm">Filtrar</span>
            </button>
            <button
              onClick={excelHandler}
              className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-3 py-2 rounded-lg shadow transition"
              title="Exportar a Excel"
            >
              <span className="text-sm sm:text-base font-semibold">Excel</span>
            </button>
          </div>
        </div>
      </div>
      {/* Espaciador para que el primer contenido no quede debajo del menú sticky */}
      <div className="h-3 sm:h-4"></div>

      {showModal && (
        <div className="fixed inset-0 z-50 mb- flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl ring-1 ring-black/5 p-5 animate-fadeInUp">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Filtrar por</h2>
            <div className="grid gap-3">
              <button className="bg-sky-600 text-white py-2.5 px-4 rounded-lg shadow hover:bg-sky-500 transition" onClick={(event) => openModal(event, 'name')}>
                Nombre
              </button>
              <button className="bg-sky-600 text-white py-2.5 px-4 rounded-lg shadow hover:bg-sky-500 transition" onClick={(event) => openModal(event, 'date')}>
                Fecha
              </button>
              <button className="bg-sky-600 text-white py-2.5 px-4 rounded-lg shadow hover:bg-sky-500 transition" onClick={(event) => openModal(event, 'type')}>
                Tipo
              </button>
              <button className="bg-slate-200 text-slate-800 py-2.5 px-4 rounded-lg shadow hover:bg-slate-300 transition" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <FilterModal
        isVisible={isModalVisible}
        filterByc={filterByc}
        onClose={closeModal}
        onSearch={handleSearch}
      />


  <section className="mx-auto max-w-6xl w-full  sm:px-6 animate-fadeInUp animate-delay-200">
        {loading ? (
          <div className="flex items-center justify-center my-4 rounded-lg">
            <div className="flex flex-col items-center px-3 py-6">
              <div className="h-10 w-10 border-4 border-steelblue-300 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span className="self-center mx-4 text-base text-black">Cargando...</span>
            </div>
          </div>
        ) : (
          <>
            {Array.isArray(items) && items.length > 0 ? (
              sortedGroupedDates.map((date, index) => (
                <div key={date} className="animate-slideInUp px-6">
                  <div className="flex items-center  justify-center mt-20">
                    <div className="inline-flex items-center gap-3 bg-slate-300 text-black px-4 py-2 rounded-full shadow-sm border border-gray-300 mx-3 sm:mx-0">
                      <span className="text-base font-semibold tracking-wide">{date}</span>
                      <span className="text-sm opacity-80">{transformDate(date)}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-black">
                        {groupedItems[date].length} DTE{groupedItems[date].length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {groupedItems[date].map((content, itemIndex) => (
                    <div key={`${content.codigo_de_generacion}-${itemIndex}`} className="animate-fadeInUp" style={{animationDelay: `${itemIndex * 0.06}s`}}>
                      <FacturaUnSend
                        content={content}
                        user={user}
                        canDelete={content.codigo_de_generacion === canDeleteId}
                      />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center my-4 rounded-lg animate-fadeIn">
                <div className="flex flex-col items-center px-3 py-6 text-black">
                  <span className="self-center mx-4 text-lg">No facturas para mostrar</span>
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
      {/* Excel button moved to top bar for better UX */}
      <ToastContainer />
  <HamburguerComponent sidebar={toggleSidebar} open={visible} />
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
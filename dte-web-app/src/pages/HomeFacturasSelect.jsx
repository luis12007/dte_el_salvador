import React, { useState, useEffect } from "react";
import FacturaSendSelect from "../components/FacturaSendSelect";
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
import x from "../assets/imgs/x.png";

const HomeFacturasSelect = ({GetInf , setIsModalOpen}) => {
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
                setUser(resultusers);
                const result = await PlantillaAPI.getByUserId(user_id, token);
                console.log("result");
                console.log(result);
                /* organize the results by fecha_y_hora_de_generacion desc*/
                result.sort((a, b) => {
                    return new Date(b.fecha_y_hora_de_generacion) - new Date(a.fecha_y_hora_de_generacion);
                });
                setItems(result || []); // Default to empty array

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

        // Simulate loading for 5 seconds
        const timer = setTimeout(() => {
            setLoading(false);
            // Fetch or set your items here
            // setItems(fetchedItems);
        }, 2000);

        return () => clearTimeout(timer);
    }, []); // Ensure this runs only once on mount

    const excelHandler = () => {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-GB').replace(/\//g, '-'); // Format as DD-MM-YYYY

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert the data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(items);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        // Write the file and trigger the download
        XLSX.writeFile(workbook, `facturas- ${dateString}.xlsx`);
    };

    const groupItemsByDate = (items) => {
        return items.reduce((acc, item) => {
          if (item.tipo === "03") { // Filter items with type "03"
            const date = item.fecha_y_hora_de_generacion.split(" ")[0]; // Extract the date part
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(item);
          }
          return acc;
        }, {});
      };

    const groupedItems = groupItemsByDate(items);

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

        try {
            if (filterData.filterByc === 'name') {
                newItems = await PlantillaAPI.getByUserIdAndName(user_id, token, filterData.value);
            } else if (filterData.filterByc === 'date') {
                newItems = await PlantillaAPI.getByUserIdAndRange(user_id, token, filterData.fromDate, filterData.toDate);
            } else if (filterData.filterByc === 'type') {
                newItems = await PlantillaAPI.getByUserIdAndType(user_id, token, filterData.value);
            }
        } catch (error) {
            console.error('Error fetching filtered items:', error);
        }
        console.log('Filtered items:', newItems);
        setItems(newItems);
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

    const sendfalse = async (event) => {
        event.preventDefault();
        setIsModalOpen(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden animate-fadeInUp">
                {/* Header */}
                <div className="flex items-center justify-between px-6 sm:px-8 py-4 bg-gradient-to-r from-sky-600 to-sky-500 text-white">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold">Seleccionar documento</h2>
                        <p className="text-xs sm:text-sm opacity-90">Crédito Fiscal (03)</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition"
                            onClick={() => setShowModal(true)}
                            title="Filtrar"
                        >
                            <img src={filterwhite} className="h-5 w-5" alt="Filtrar" />
                            <span className="text-sm">Filtrar</span>
                        </button>
                        <button
                            className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 transition"
                            onClick={(event) => sendfalse(event)}
                            title="Cerrar"
                        >
                            <img src={x} className="h-5 w-5" alt="Cerrar" />
                        </button>
                    </div>
                </div>

                {/* Filter modal trigger for mobile */}
                <div className="sm:hidden px-4 pt-3">
                    <button
                        className="w-full flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 px-4 py-2 rounded-lg transition"
                        onClick={() => setShowModal(true)}
                    >
                        <img src={filterwhite} className="h-5 w-5" alt="Filtrar" />
                        <span className="text-sm font-medium">Filtrar</span>
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto px-4 sm:px-6 py-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center">
                                <div className="h-10 w-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <span className="text-slate-600">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {Array.isArray(items) && items.length > 0 ? (
                                Object.keys(groupedItems).map((date) => (
                                    <div key={date} className="animate-fadeInUp">
                                        <div className="sticky top-0 z-10">
                                            <div className="mx-1 my-3">
                                                <div className="inline-flex items-center gap-3 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full shadow-sm">
                                                    <span className="text-sm font-semibold tracking-wide">{date}</span>
                                                    <span className="text-xs opacity-70">{transformDate(date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {groupedItems[date].map((content, index) => (
                                                <FacturaSendSelect key={index} content={content} user={user} GetInf={GetInf} />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center text-slate-600">
                                        <p className="text-base">No hay documentos para mostrar.</p>
                                        <p className="text-sm opacity-70">Prueba ajustando los filtros.</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Inline filter modal */}
                {showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-5">
                            <h3 className="text-lg font-semibold mb-4">Filtrar por</h3>
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

                {/* External filter modal component */}
                <FilterModal
                    isVisible={isModalVisible}
                    filterByc={filterByc}
                    onClose={closeModal}
                    onSearch={handleSearch}
                />

                {/* Hidden sidebar trigger preserved */}
                <div className="hidden">
                    <HamburguerComponent sidebar={toggleSidebar} open={visible} />
                </div>
            </div>
        </div>
    );
};

export default HomeFacturasSelect;
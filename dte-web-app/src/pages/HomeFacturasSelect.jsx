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

const HomeFacturasSelect = ({GetInf}) => {
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
            const date = item.fecha_y_hora_de_generacion.split(" ")[0]; // Extract the date part
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
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


    return (
        <div className="w-full min-h-screen bg-steelblue-300 flex flex-col pt-[66px] pb-[33px] pr-[22px] box-border ch:items-center">
            <button className="bg-gray-300 w-2/12 self-end h-12 border-black rounded-lg drop-shadow-lg " onClick={() => setShowModal(true)}>
                <img src={filterwhite} className="h-9 pl-0.5 self-center mr-3" alt="" />
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-6">Filtrar Por</h2>
                        <button className="bg-steelblue-300 text-white py-3 px-6 rounded-lg shadow-md mb-4 text-lg" onClick={(event) => openModal(event, 'name')}>
                            Nombre
                        </button>
                        <button className="bg-steelblue-300 text-white py-3 px-6 rounded-lg shadow-md mb-4 text-lg" onClick={(event) => openModal(event, 'date')}>
                            Fecha
                        </button>
                        <button className="bg-steelblue-300 text-white py-3 px-6 rounded-lg shadow-md mb-4 text-lg" onClick={(event) => openModal(event, 'type')}>
                            Tipo
                        </button>
                        <button className="bg-lightcoral text-white py-3 px-6 rounded-lg shadow-md text-lg" onClick={() => setShowModal(false)}>
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


            <section className="pl-2  ">
                {loading ? (
                    <div className="flex items-center justify-center my-4 rounded-lg">
                        <div className="flex flex-col items-center border-8 px-3 py-2 drop-shadow-xl border-opacity-45 rounded-lg justify-center bg-slate-300 border-t border-gray-300">
                            <span className="self-center mx-4 text-xl [-webkit-text-stroke:1px_#000] font-thin">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {Array.isArray(items) && items.length > 0 ? (
                            Object.keys(groupedItems).map((date) => (
                                <div key={date}>
                                    <div className="flex items-center justify-center my-4 rounded-lg">
                                        <div className="flex flex-col items-center border-8 px-3 py-2 drop-shadow-xl border-opacity-45 rounded-lg justify-center bg-slate-300 border-t border-gray-300">
                                            <span className="self-center mx-4 text-xl [-webkit-text-stroke:1px_#000] font-thin">{date}</span>
                                            <div>{transformDate(date)}</div>
                                        </div>
                                    </div>
                                    {groupedItems[date].map((content, index) => (
                                        <FacturaSendSelect key={index} content={content} user={user} GetInf={GetInf} />
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center my-4 rounded-lg">
                                <div className="flex flex-col items-center border-8 px-3 py-2 drop-shadow-xl border-opacity-45 rounded-lg justify-center bg-slate-300 border-t border-gray-300">
                                    <span className="self-center mx-4 text-xl [-webkit-text-stroke:1px_#000] font-thin">No facturas para mostrar</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>



            <HamburguerComponent sidebar={toggleSidebar} visible={visible} />
        </div>
    );
};

export default HomeFacturasSelect;
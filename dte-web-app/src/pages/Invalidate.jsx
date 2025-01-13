import React, { useState, useEffect } from "react";
import FacturaUnSend from "../components/FacturaUnSend";
import FacturaInvalidate from "../components/FacturaInvalidate";
import HamburguerComponent from "../components/HamburguerComponent";
import SidebarComponent from "../components/SideBarComponent";
import PlantillaAPI from "../services/PlantillaService";
import UserService from "../services/UserServices";
import LoginAPI from "../services/Loginservices";
import * as XLSX from "xlsx";

const Invalidate = () => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    const [items, setItems] = useState([]);
    const tokenminis = localStorage.getItem("tokenminis");
    const [user, setUser] = useState({});

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

    return (
        <div className="w-screen  bg-steelblue-300  flex flex-col  pt-[66px] pb-[33px] pr-[22px] box-border gap-[495px_0px] ">
            <SidebarComponent visible={visible} />
            <section className=" pl-2">

                {/* show the date of the bills if the bill is in the same date just stack them */}
                {Array.isArray(items) && items.length > 0 ? (
                    Object.keys(groupedItems).map((date) => (
                        <div key={date}>
                            <div className="flex items-center  justify-center my-4">
                                <div className="flex-grow border-t  border-gray-300"></div>
                                <span className="mx-4 text-xl  font-thin">{date}</span>
                                <div className="flex-grow border-t  border-gray-300"></div>
                            </div>
                            {groupedItems[date].map((content, index) => (
                                <FacturaInvalidate key={index} content={content} user={user} />
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No facturas para mostrar</p>
                )}
            </section>

            <HamburguerComponent sidebar={toggleSidebar} visible={visible} />
        </div>
    );
};

export default Invalidate;

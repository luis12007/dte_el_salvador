import React from "react";
import user from "../assets/imgs/usuario.png";
import block from "../assets/imgs/bloquear.png";

const SistemaDTE = () => {
    return (
        <form className="m-0 bottom-52 left-0 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] w-[390px] flex flex-col items-start justify-start pt-[19px] pb-[51px] pr-6 pl-5 box-border gap-[31.5px_0px] max-w-full z-[1] relative">
            <div className="w-[390px] h-[341px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
            <div className="w-[325px] flex flex-row items-start justify-center max-w-full">
                <b className="relative text-3xl font-inria-sans text-black text-left z-[2]">
                    Sistema de DTE
                </b>
            </div>
            <div className="self-stretch rounded-3xs bg-lavender flex flex-row items-start justify-start pt-[9px] px-3 pb-2 box-border gap-[6px] max-w-full z-[2]">
                <div className="h-10 w-[346px] relative rounded-3xs bg-lavender hidden max-w-full" />
                <img
                    className="h-[23px] w-5 relative object-cover min-h-[23px] z-[1]"
                    alt=""
                    src={user}
                />
                <input
                    className="w-[54px] [border:none] [outline:none] bg-[transparent] h-5 flex flex-col items-start justify-start pt-0.5 px-0 pb-0 box-border font-inter font-light text-mini text-gray"
                    placeholder="Usuario"
                    type="text"
                />
            </div>
            <div className="self-stretch flex flex-col items-start justify-start gap-[16.5px_0px] max-w-full">
                <div className="self-stretch rounded-3xs bg-lavender flex flex-row items-start justify-start py-2.5 px-[9px] box-border gap-[9px] max-w-full z-[2]">
                    <div className="h-10 w-[346px] relative rounded-3xs bg-lavender hidden max-w-full" />
                    <img
                        className="h-5 w-5 relative object-cover min-h-[20px] z-[1]"
                        alt=""
                        src={block}
                    />
                    <input
                        className="w-[84px] [border:none] [outline:none] bg-[transparent] h-5 flex flex-col items-start justify-start pt-[5px] px-0 pb-0 box-border font-inter text-xs text-gray"
                        placeholder="**************"
                        type="text"
                    />
                </div>
                <div className="flex flex-row items-start justify-start py-0 pr-[75px] pl-20">
                    <div className="relative text-lg [text-decoration:underline] font-light font-inria-sans text-deepskyblue text-left z-[2]">
                        Recuperar mi contraseña
                    </div>
                </div>
                <div className="self-stretch flex flex-row items-start justify-center py-0 pr-5 pl-6">
                    <button className="cursor-pointer [border:none] pt-3 pb-[13px] pr-10 pl-[31px] bg-steelblue rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start z-[2] hover:bg-slategray">
                        <div className="h-[47px] w-[138px] relative rounded-3xs bg-steelblue shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
                        <b className="relative text-lg font-inria-sans text-white text-left z-[1]">
                            Ingresar
                        </b>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SistemaDTE;

import { useState, useEffect } from "react";


const TreeNode = ({ text, data }) => {
  const [number, setNumber] = useState(data);

  useEffect(() => {

    if (typeof data == "number") {
      setNumber(data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 1,000
      return;
    }
    if (data.length > 3) {
      setNumber(data.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 1,000
    } else {
      setNumber(data);
    }
  }, [data]);
  
  return (
    <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full text-left text-mini text-black font-inria-sans ch:w-1/3 ch:self-center">
      <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-5 box-border gap-[14px] max-w-full z-[1]">
        <div className="self-stretch h-[101px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch h-[101px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-[11px] px-[17px] pb-2 box-border relative max-w-full z-[2]">
          <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full z-[0]" />
          {/* <img
            className="h-4 w-[18px] absolute !m-[0] right-[20px] bottom-[9px] object-contain z-[3]"
            alt=""
            src="/atras-1@2x.png"
          /> */}
          <b className="relative z-[3]">{text}</b>
        </div>
        <div className="flex flex-row items-start justify-start py-0 px-[17px] text-6xl">
          <div className="relative whitespace-nowrap z-[2]">${number}</div>
        </div>
      </div>
    </section>
  );
};

export default TreeNode;

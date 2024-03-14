import { useMemo } from "react";

const UserLabel = ({ correoLuisAlexanderContaiPadding }) => {
  const userLabelStyle = useMemo(() => {
    return {
      padding: correoLuisAlexanderContaiPadding,
    };
  }, [correoLuisAlexanderContaiPadding]);

  return (
    <div
      className="self-stretch flex flex-row items-start justify-start text-left text-xs text-black font-inria-sans"
      style={userLabelStyle}
    >
      <div className="flex flex-row items-end justify-start gap-[0px_11px]">
        <div className="flex flex-col items-start justify-start pt-0 px-0 pb-1.5">
          <img
            className="w-[43px] h-[47px] relative object-cover z-[1]"
            loading="lazy"
            alt=""
            src="/usuario-2@2x.png"
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-[9px_0px]">
          <div className="relative z-[1]">
            <b>Nombre:</b>
            <span> Luis Alexander hernandez Martinez</span>
          </div>
          <div className="relative z-[1]">
            <b>Correo:</b>
            <span> Luis Alexander Hernández Martínez</span>
          </div>
          <div className="relative z-[1]">
            <b>NIT:</b>
            <span> 123124123123121241</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLabel;

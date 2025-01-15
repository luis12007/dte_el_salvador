import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const FrameComponent2 = ({
  actionFrameAlignSelf,
  actionFramePadding,
  actionFrameWidth,
  updateControlsBackgroundColor,
  rectangleDivBackgroundColor,
  handleSubmit,
}) => {
  const navigate = useNavigate();



  const actionFrameStyle = useMemo(() => {
    return {
      alignSelf: actionFrameAlignSelf,
      padding: actionFramePadding,
      width: actionFrameWidth,
    };
  }, [actionFrameAlignSelf, actionFramePadding, actionFrameWidth]);

  const updateControlsStyle = useMemo(() => {
    return {
      backgroundColor: updateControlsBackgroundColor,
    };
  }, [updateControlsBackgroundColor]);

  const rectangleDivStyle = useMemo(() => {
    return {
      backgroundColor: rectangleDivBackgroundColor,
    };
  }, [rectangleDivBackgroundColor]);

  const GoBackHandler = () => {
    navigate("/Principal");
  }


  return (
    <section
      className="self-stretch flex flex-row items-start justify-center py-0 px-5"
      style={actionFrameStyle}
    >
      <div className="flex flex-col items-start justify-start gap-[12px_0px]">
        <button
        onClick={handleSubmit} className="cursor-pointer [border:none] pt-3 px-[29px] pb-[13px] bg-seagreen-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start hover:bg-seagreen-100">
          <div className="h-[47px] w-[138px] relative rounded-3xs bg-seagreen-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <b className="relative text-lg font-inria-sans text-white text-left z-[1]">
            Actualizar
          </b>
        </button>
        <button
          onClick={GoBackHandler}
          className="cursor-pointer [border:none] pt-[9px] pb-4 pr-[34px] pl-[33px] bg-indianred-300 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start hover:bg-lightcoral"
          style={updateControlsStyle}
        >
          <div
            className="h-[47px] w-[138px] relative rounded-3xs bg-indianred-300 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden"
            style={rectangleDivStyle}
          />
          <b className="relative text-lg pt-1 font-inria-sans text-white text-left z-[1]">
            Regresar
          </b>
        </button>
      </div>
    </section>
  );
};

export default FrameComponent2;

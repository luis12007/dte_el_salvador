import FrameGroup from "../components/FrameGroup";

const Home1 = () => {
  return (
    <div className="w-full h-[930px] relative bg-steelblue-300 overflow-hidden flex flex-col items-end justify-start pt-[75px] px-5 pb-0 box-border tracking-[normal]">
      <FrameGroup />
      <img
        className="w-[30px] h-[30px] absolute !m-[0] top-[14px] left-[18px] object-cover"
        loading="lazy"
        alt=""
        src="/image-10-4@2x.png"
      />
      <img
        className="mr-[-210px] w-[811px] h-[827px] relative object-cover max-w-[208%] shrink-0 mt-[-140px]"
        alt=""
        src="/image-7@2x.png"
      />
    </div>
  );
};

export default Home1;

import SistemaDTE from "../components/SistemDTE";
import mylogo from "../assets/imgs/mysoftlogo.png";
import hi from "../assets/imgs/hi.webp";
import bglogin from "../assets/imgs/bglogin.webp";

const Login = () => {
  return (
    <div className="w-full relative bg-steelblue overflow-hidden flex flex-col items-center justify-start pt-[15px] px-0 pb-0 box-border gap-[55px_0px] tracking-[normal]">
      <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
        <img
          className="h-[107px] w-[149px] relative object-cover"
          loading="lazy"
          alt=""
          src={mylogo}
        />
      </div>
      <main className="self-stretch flex flex-col items-center justify-center h-[753px] relative max-w-full">
        <SistemaDTE />
        <section className="absolute top-[170px] left-[0px] w-[430px] h-[583px]">
          <img
            className="absolute top-[0px] left-[-185px] w-[811px] h-[827px] object-cover"
            alt=""
            src={bglogin}
          />
          <img
            className="relative top-[185px] left-[-55px] w-[324px] h-[457px] object-cover z-[2]"
            alt=""
            src={hi}
          />
        </section>
      </main>
    </div>
  );
};

export default Login;

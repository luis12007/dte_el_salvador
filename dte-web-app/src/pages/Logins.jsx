import SistemaDTE from "../components/SistemaDTE";
import { useNavigate } from "react-router-dom";
import LoginAPI from "../services/Loginservices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const navigate = useNavigate();

  const HomeHandler = async (props) => {
    /* navigate("/principal"); */
    const result = await LoginAPI.login(props);

    console.log(result);
    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", result.user);
      localStorage.setItem("username", props.username);
      navigate("/principal");
    }else{
      toast.error("Credenciales incorrectas");

    }
  }

  return (
    <div className="w-full relative bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[15px] px-0 pb-0 box-border gap-[55px_0px] tracking-[normal]">
      <div className="self-stretch flex flex-row items-start justify-center py-0 px-5">
        <img
          className="h-[107px] w-[149px] relative object-cover"
          loading="lazy"
          alt=""
          src="/-cee3707255594486baada125edfbc74cremovebgpreview-1@2x.png"
        />
      </div>
      <main className="self-stretch h-[753px] relative max-w-full">
        <SistemaDTE goin={HomeHandler}/>
        <section className="absolute top-[170px] left-[0px] w-[430px] h-[583px]">
          <img
            className="absolute top-[0px] left-[-185px] w-[811px] h-[827px] object-cover"
            alt=""
            src="/image-6@2x.png"
          />
          <img
            className="absolute top-[177.4px] left-[-37px] w-[231.3px] h-[168.4px] z-[1]"
            loading="lazy"
            alt=""
            src="/ellipse-1.svg"
          />
          <img
            className="absolute top-[185px] left-[-55px] w-[324px] h-[457px] object-cover z-[2]"
            alt=""
            src="/image-5@2x.png"
          />
        </section>
      </main>
      <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </div>
  );
};

export default Login;

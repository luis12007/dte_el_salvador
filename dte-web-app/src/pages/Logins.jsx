import SistemaDTE from "../components/SistemaDTE";
import { useNavigate } from "react-router-dom";
import LoginAPI from "../services/Loginservices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import guitar1 from "../assets/imgs/guitar1.png";
import guitar2 from "../assets/imgs/guitar2.png";

const Login = () => {

  const navigate = useNavigate();

  const HomeHandler = async (props) => {
    /* navigate("/principal"); */
    try {
    const result = await LoginAPI.login(props);
    console.log(result);
    
    if (result.status === "success") {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("username", result.username);
      navigate("/principal");
      return

    }else{
      toast.error("Credenciales incorrectas");
      console.log("Credenciales incorrectas");
      return
    }

  } catch (error) {
    console.log(error);
    toast.error("Conexión no disponible");
  }
  }

  return (
    <div className="w-full relative h-screen bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[15px] px-0 pb-0 box-border gap-[55px_0px] tracking-[normal]">
      <div className="self-stretch  flex flex-row items-start justify-center">
        <img
          className="h-[150px] w-[150px] relative object-cover"
          loading="lazy"
          alt=""
          src={guitar1}
        />
      </div>
      <main className="self-center items-center justify-center flex w-full mr-10 ml-10 relative max-w-full">
        <SistemaDTE goin={HomeHandler}/>
        <section className="absolute top-[170px]  left-[0px] w-[430px] h-[583px]">
          <img
            className="absolute top-[0px] left-[-185px] w-[811px] h-[827px] object-cover"
            alt=""
            src="/image-6@2x.png"
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

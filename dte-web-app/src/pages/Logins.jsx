import SistemaDTE from "../components/SistemaDTE";
import { useNavigate } from "react-router-dom";
import LoginAPI from "../services/Loginservices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import mysoftlogo from "../assets/imgs/mysoftlogo.png";

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
      localStorage.setItem("ambiente", result.ambiente);
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
      <div className="self-stretch flex flex-row items-start justify-center animate-fadeIn">
        <img
          className="h-[150px] w-[150px] relative object-cover"
          loading="lazy"
          alt=""
          src={mysoftlogo}
        />
      </div>
      <main className="self-center items-center justify-center flex w-full mr-10 ml-10 relative max-w-full animate-fadeInUp animate-delay-200">
        <SistemaDTE goin={HomeHandler}/>
        <section className="absolute top-[170px] left-[0px] w-[430px] h-[583px]">
        <img
  className="absolute top-[0px] left-[-185px] w-[811px] h-[827px] object-cover mb:hidden"
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

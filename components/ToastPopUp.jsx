import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastPopUp = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
};

export default ToastPopUp;

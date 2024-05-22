import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
  return <ToastContainer />;
};

export const notify = (message, type = 'info') => {
  toast(message, { type });
};

export default Toast;

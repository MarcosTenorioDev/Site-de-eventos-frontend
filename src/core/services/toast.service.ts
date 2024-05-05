import { toast } from 'react-toastify';

class ToastService {
  static showSuccess(message: string) {
    return toast(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
        })
  }
}

export default ToastService;

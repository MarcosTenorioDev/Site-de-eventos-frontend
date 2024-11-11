import { Bounce, toast } from "react-toastify";

class ToastService {
	static showSuccess(message: string, onClose?: <T = {}>(props: T) => void) {
		return toast.success(message, {
			position: "top-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
			transition: Bounce,
			onClose: onClose,
		});
	}

	static showError(message: string, onClose?: <T = {}>(props: T) => void) {
		return toast.error(message, {
			position: "top-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
			transition: Bounce,
			onClose: onClose,
		});
	}

	static showWarning(message: string, onClose?: <T = {}>(props: T) => void) {
		return toast.warning(message, {
			position: "top-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
			transition: Bounce,
			onClose: onClose,
		});
	}
}

export default ToastService;

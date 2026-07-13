import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const GlobalToast = () => (
	<ToastContainer
		position="bottom-right"
		autoClose={5000}
		closeOnClick
		draggable
		limit={3}
		newestOnTop
		pauseOnFocusLoss
		pauseOnHover
		theme="light"
	/>
);

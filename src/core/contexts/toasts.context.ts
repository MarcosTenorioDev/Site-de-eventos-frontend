import { createContext, useContext } from "react";
import ToastService from "../services/toast.service";

export enum ToastType {
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning",
}

export type toastContext = {
  showToast(message: string, toastType: ToastType): void;
};

export const toastContext = createContext<toastContext>({
  showToast(message, toastType) {
    switch (toastType) {
      case "success":
        ToastService.showSuccess(message);
        break;

      case "error":
        ToastService.showError(message)
        break;

      default:
    }
  },
});

export const useToastContext = () => useContext(toastContext);

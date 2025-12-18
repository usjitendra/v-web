import { toast } from "react-hot-toast";

/* Success */
export const showSuccess = (message) =>
  toast.success(message, {
    style: {
      background: "#16a34a",
      color: "#fff",
      fontWeight: "500",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#16a34a",
    },
  });
/* Error */
export const showError = (message) =>
  toast.error(message, {
    style: {
      background: "#dc2626",
      color: "#fff",
      fontWeight: "500",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#dc2626",
    },
  });

/* Loading */
export const showLoading = (message) =>
  toast.loading(message, {
    style: {
      background: "#2563eb",
      color: "#fff",
      fontWeight: "500",
    },
  });

/* Dismiss */
export const dismissToast = () => toast.dismiss();

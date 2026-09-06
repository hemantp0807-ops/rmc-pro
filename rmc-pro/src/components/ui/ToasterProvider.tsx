import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 1500,

        style: {
          borderRadius: "12px",
          background: "#1e293b",
          color: "#fff",
          fontSize: "14px",
          padding: "14px 18px",
          marginTop:"90px",
        },

        success: {
          style: {
            background: "#16a34a",
          },
        },

        error: {
          style: {
            background: "#dc2626",
          },
        },
      }}
    />
  );
}
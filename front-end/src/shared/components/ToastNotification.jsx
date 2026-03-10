import React from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const bgColor = isSuccess ? "bg-success" : "bg-danger";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-4"
      style={{ zIndex: 9999 }}
    >
      <div
        className={`toast show align-items-center text-white ${bgColor} border-0 shadow-lg`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ minWidth: "300px" }}
      >
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center gap-2 fw-medium fs-6">
            <Icon size={24} />
            {toast.message}
          </div>

          {onClose && (
            <button
              type="button"
              className="btn text-white me-2 m-auto border-0"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

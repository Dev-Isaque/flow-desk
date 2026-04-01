import { useState } from "react";
import { ConfirmContext } from "../../shared/context/confirmContext";
import { Modal } from "../../shared/components/Modal";
import { Button } from "../../shared/components/Button";

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    show: false,
    title: "Confirmação",
    message: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    variant: "danger",
    resolve: null,
  });

  const confirm = (options) => {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new Promise((resolve) => {
      setConfirmState({
        show: true,
        title: options.title || "Confirmação",
        message: options.message || "",
        confirmText: options.confirmText || "Confirmar",
        cancelText: options.cancelText || "Cancelar",
        variant: options.variant || "danger",
        resolve,
      });
    });
  };

  const handleClose = () => {
    setConfirmState((prev) => ({
      ...prev,
      show: false,
      resolve: null,
    }));
  };

  const handleConfirm = () => {
    confirmState.resolve?.(true);
    handleClose();
  };

  const handleCancel = () => {
    confirmState.resolve?.(false);
    handleClose();
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Modal
        title={confirmState.title}
        show={confirmState.show}
        onClose={handleCancel}
        footer={
          <>
            <Button className="btn btn-light" onClick={handleCancel}>
              {confirmState.cancelText}
            </Button>

            <Button
              className={`btn btn-${confirmState.variant}`}
              onClick={handleConfirm}
            >
              {confirmState.confirmText}
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>{confirmState.message}</p>
      </Modal>
    </ConfirmContext.Provider>
  );
}

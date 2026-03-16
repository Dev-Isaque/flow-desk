import { useEffect } from "react";
import { Button } from "./Button";

export function Modal({
  id = "exampleModal",
  title = "Título",
  children,
  footer,
  size,
  centered = true,
  show = false,
  onClose,
}) {
  const dialogClass = [
    "modal-dialog",
    centered ? "modal-dialog-centered" : "",
    size ? `modal-${size}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && show) {
        document.activeElement?.blur();
        onClose?.();
      }
    }

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [show, onClose]);

  useEffect(() => {
    if (!show) {
      document.activeElement?.blur();
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        id={id}
        tabIndex={-1}
        aria-labelledby={`${id}Label`}
        aria-hidden={!show}
        role="dialog"
      >
        <div className={dialogClass}>
          <div className="modal-content theme-modal-content border-0">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title fw-bold theme-text" id={`${id}Label`}>
                {title}
              </h5>
            </div>

            <div className="modal-body py-3 theme-text">{children}</div>

            <div className="modal-footer border-top-0">
              {footer ?? (
                <>
                  <Button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>

                  <Button type="button" className="btn btn-primary">
                    Ok
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
}

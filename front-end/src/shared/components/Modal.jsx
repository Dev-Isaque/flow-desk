import { Button } from "./Button";

export function Modal({
  id = "exampleModal",
  title = "Título",
  children,
  footer,
  size,
  centered = true,
}) {
  const dialogClass = [
    "modal-dialog",
    centered ? "modal-dialog-centered" : "",
    size ? `modal-${size}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className={dialogClass}>
        <div className="modal-content theme-modal-content border-0">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title fw-bold theme-text" id={`${id}Label`}>
              {title}
            </h5>

            <button
              type="button"
              className="btn-close theme-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body py-3 theme-text">{children}</div>

          <div className="modal-footer border-top-0">
            {footer ?? (
              <>
                <Button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
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
  );
}

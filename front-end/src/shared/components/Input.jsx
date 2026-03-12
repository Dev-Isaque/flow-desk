import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, as = "input", className = "", children, ...props },
  ref,
) {
  const Component = as;

  return (
    <div className="auth-field">
      {label && <label className="form-label">{label}</label>}

      <Component ref={ref} className={`theme-input ${className}`} {...props}>
        {children}
      </Component>
    </div>
  );
});

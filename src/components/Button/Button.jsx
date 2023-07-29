import './Button.css';

const Button = ({ size, disabled, onClick, children }) => (
  <button
    className={`btn btn-${size}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
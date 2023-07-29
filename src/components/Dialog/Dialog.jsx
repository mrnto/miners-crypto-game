import './Dialog.css';

const Dialog = ({ open, handleConfirm, text }) => (
  <>
    <div className={open ? 'dialog open' : 'dialog'}>
      <div className='dialog-content'>
        <h4>CONFIRM</h4>
        <div>
          <h2>{text}</h2>
        </div>
      </div>
      <div className='dialog-btns'>
        <button onClick={() => handleConfirm(true)}>YES</button>
        <button onClick={() => handleConfirm(false)}>NO</button>
      </div>
    </div>
    <div className='dialog-overlay' onClick={() => handleConfirm(false)}/>
  </>
);

export default Dialog;
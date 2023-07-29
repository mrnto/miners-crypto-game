import './Sidebar.css';

const Sidebar = ({ open, toggle, data }) => (
  <>
    <div className='sidebar-open-btn' onClick={toggle}>&#9776;</div>
    <div className={open ? 'sidebar open' : 'sidebar'}>
      <div>
        <div className='sidebar-close-btn' onClick={toggle}>&times;</div>
        <ul className='sidebar-menu'>
          {data.map((elem, idx) => (
            <li key={idx} onClick={elem.func}>
              {elem.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className='sidebar-overlay' onClick={toggle}></div>
  </>
);

export default Sidebar;
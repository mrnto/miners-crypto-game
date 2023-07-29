import './Header.css';

const Header = ({ data }) => (
  <header>
    <h2>Miners!</h2>
    <div className='header-content'>
      {data.map((elem, idx) => (
        <li key={idx}>
          <div className='header-icon-wrapper baseline'>
            <img src={elem.img} alt={elem.alt} />
          </div>
          <p>{elem.val}</p>
        </li>
      ))}
    </div>
  </header>
);

export default Header;
import Button from '../Button';
import pickaxe from '../../assets/pickaxe.svg';
import './Grid.css';

const Grid = ({ miners, action, setIdx }) => (
  <section>
    <div className='container'>
      <div className='grid-row'>
        {miners.map((level, idx) => (
          <div className='grid-item' key={idx}>
            <span>
              <h3>{level} LEVEL</h3>
              <Button
                size={"md"}
                disabled={level == 5 ? true : false}
                onClick={() => { setIdx(idx); action(); }}
              >
                {level == 5 ? "Max" : "Upgrade"}
              </Button>
            </span>
            <img src={pickaxe} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Grid;
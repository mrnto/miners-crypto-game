import Button from '../Button';
import './Hero.css';

const Hero = ({ onClick }) => (
  <section className='hero'>
    <div className='hero-content'>
      <h1>Miners!</h1>
      <h3>Play the new crypto game now!</h3>
      <Button size={"lg"} onClick={onClick}>Connect</Button>
    </div>
  </section>
);

export default Hero;
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles['container']}>
                <div className={styles['hero-box']}>
                    <h1>Up to 25% 0ff - All bikes deals</h1>
                    <Link to="/shop">Shop Now</Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;

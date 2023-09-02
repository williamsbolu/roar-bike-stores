import classes from './Notification.module.css';
import icon from '../../assets/sprite.svg';

const Notification = (props) => {
    let specialClasses;

    if (props.status === 'error') {
        specialClasses = `${classes.notification} ${classes.error}`;
    }

    if (props.status === 'complete') {
        specialClasses = `${classes.notification} ${classes.success}`;
    }

    const stylesClass = `${classes.notification} ${specialClasses}`;

    return (
        <aside className={stylesClass}>
            <div className={classes['cart-detail-box']}>
                {props.status === 'complete' && (
                    <svg className={classes['icon-check']}>
                        <use xlinkHref={`${icon}#icon-check`} />
                    </svg>
                )}
                <p>{props.message}</p>
            </div>

            <div className={classes['button-box']}>
                <button className={classes['icon-btn']} onClick={props.onClose}>
                    <svg className={classes['iconx']}>
                        <use xlinkHref={`${icon}#icon-x`} />
                    </svg>
                </button>
            </div>
        </aside>
    );
};

export default Notification;

import { Fragment } from 'react';
import classes from './ButtonSpinner.module.css';

const ButtonSpinner = (props) => {
    return (
        <Fragment>
            <div className={props.type === 'white' ? classes['spinner'] : classes['spinner-dark']}></div>
        </Fragment>
    );
};

export default ButtonSpinner;

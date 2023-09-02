import { Fragment } from 'react';
import ReactDom from 'react-dom';

import classes from './Modal.module.css';

const BackDrop = (props) => {
    const cartBackdropClass = `${classes['backdrop']} ${
        !props.cartIsEnabled ? classes['cut-backdrop-display'] : classes['add-backdrop-display']
    }`;
    const menuBackdropClass = `${classes['backdrop']} ${
        !props.menuIsEnabled ? classes['cut-backdrop-display'] : classes['add-backdrop-display']
    }`;

    return (
        <Fragment>
            {props.content === 'cart' && <div className={cartBackdropClass} onClick={props.onClose}></div>}
            {props.content === 'menu' && <div className={menuBackdropClass} onClick={props.onClose}></div>}
        </Fragment>
    );
};

const ModalOverlay = (props) => {
    const cartModalClass = `${classes.cart} ${props.cartIsEnabled ? classes['show-cart'] : ''}`;
    const menuModalClass = `${classes.menu} ${props.menuIsEnabled ? classes['show-menu'] : ''}`;

    return (
        <Fragment>
            {props.content === 'cart' && <div className={cartModalClass}>{props.children}</div>}
            {props.content === 'menu' && <div className={menuModalClass}>{props.children}</div>}
        </Fragment>
    );
};

const portalElement = document.getElementById('overlays');

const Modal = (props) => {
    return (
        <Fragment>
            {ReactDom.createPortal(
                <BackDrop
                    onClose={props.onClose}
                    content={props.content}
                    cartIsEnabled={props.cartIsEnabled}
                    menuIsEnabled={props.menuIsEnabled}
                />,
                portalElement
            )}
            {ReactDom.createPortal(
                <ModalOverlay
                    content={props.content}
                    cartIsEnabled={props.cartIsEnabled}
                    menuIsEnabled={props.menuIsEnabled}
                >
                    {props.children}
                </ModalOverlay>,
                portalElement
            )}
        </Fragment>
    );
};

export default Modal;

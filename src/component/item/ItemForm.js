import { useRef } from 'react';
import classes from './ItemForm.module.css';

const ProductForm = (props) => {
    const amountInputRef = useRef();

    return (
        <form className={classes.form}>
            <input type="number" min="1" max="4" defaultValue="1" ref={amountInputRef} />
            <button>
                <span className={classes['text']}>Add To Cart</span>
            </button>
        </form>
    );
};

export default ProductForm;

/* <button>
    {isLoading && (
        <span className={classes['spinner']}>
            <ProductItemSpinner type="cart" />
        </span>
    )}
    {!isLoading && <span className={classes['text']}>Add To Cart</span>}
</button>; */

import classes from './ItemList.module.css';
import Item from './Item';

import LoadingSpinner from '../UI/LoadingSpinner';

const ItemList = (props) => {
    return (
        <div className={classes['item-body']}>
            {props.isCollection === 'collection' && (
                <div className={classes['item__head-text']}>
                    <h2>Recent Products</h2>
                    <p>Browse our most recent bikes and other accessories with the best deals.</p>
                </div>
            )}

            {props.isCollection === 'optional' && (
                <div className={classes['item__head-optional']}>
                    <h2>You may also like...</h2>
                </div>
            )}

            {props.status === 'pending' && (
                <div className="item-centered">
                    <LoadingSpinner />
                </div>
            )}
            {props.error && (
                <div className="item-centered">
                    <p>{props.error}</p>
                </div>
            )}

            {props.status === 'completed' && !props.error && (
                <div className={classes['items-grid']}>
                    {props.items.data.map((item) => (
                        <Item
                            key={item._id}
                            id={item._id}
                            imageCover={item.imageCover}
                            name={item.name}
                            price={item.price}
                            slug={item.slug}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemList;

import classes from './WishList.module.css';

import WishListItem from './WishListItem';

const wishList = (props) => {
    return (
        <section className={classes['section-items']}>
            <div className={classes['item__head-text']}>
                <h2>Your Product WishList</h2>
            </div>

            <div className={classes['items-grid']}>
                {props.items.map((item) => (
                    <WishListItem
                        key={item.item._id}
                        itemId={item.item._id} // item id
                        id={item._id} // wishlist id
                        img={item.item.imageCover}
                        name={item.item.name}
                        price={item.item.price}
                        slug={item.item.slug || item.slug}
                    />
                ))}
            </div>
        </section>
    );
};

export default wishList;

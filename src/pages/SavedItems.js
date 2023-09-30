import { useSelector } from 'react-redux';

import WishlistPageEmpty from '../component/wishlist/WishlistPageEmpty';
import WishList from '../component/wishlist/WishList';

const SavedItems = () => {
    const wishListData = useSelector((state) => state.wishlist.items);

    if (wishListData.length === 0) {
        return <WishlistPageEmpty />;
    }

    return <WishList items={wishListData} />;
};

export default SavedItems;

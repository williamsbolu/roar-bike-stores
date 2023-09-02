import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useHttp from '../hooks/use-http';

import ItemList from '../component/item/ItemList';
import { getAllItems } from '../lib/api';

const MountainBikes = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const sortOptions = queryParams.get('sort');

    const { sendRequest, status, data: items, error } = useHttp(getAllItems, true);

    useEffect(() => {
        if (!sortOptions) {
            // run this by default when the component is rendered
            sendRequest('?type=mountain-bike'); // here we could order by the item creation date
            return;
        }

        // run this when we change the sorting of the items
        sendRequest(`?type=mountain-bike&sort=${sortOptions}`);
    }, [sendRequest, sortOptions]);

    const changeSortingHandler = (event) => {
        const sortOption = event.target.value;

        if (sortOption === 'default') {
            navigate(`${location.pathname}`);
        } else if (sortOption === 'price-low') {
            navigate(`${location.pathname}?sort=price`);
        } else if (sortOption === 'price-high') {
            navigate(`${location.pathname}?sort=-price`);
        }
    };

    return (
        <section className="section-items">
            <div className="item-head">
                <div className="link-box">
                    <Link to="/">Home /</Link>
                    <p>Mountain Bikes</p>
                </div>

                <div className="filter-box">
                    <select className="subject" onChange={changeSortingHandler}>
                        <option value="default">Filter by</option>
                        <option value="price-low">lowest price</option>
                        <option value="price-high">highest price</option>
                    </select>
                </div>
            </div>
            <ItemList status={status} error={error} items={items} />
        </section>
    );
};

export default MountainBikes;

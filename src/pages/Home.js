import { Fragment, useEffect } from 'react';
import useHttp from '../hooks/use-http';

import Hero from '../component/layout/Hero';
import ItemList from '../component/item/ItemList';
import { getRecentTours } from '../lib/api';

const Home = () => {
    const { sendRequest, status, data: recentItems, error } = useHttp(getRecentTours, true);

    useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    return (
        <Fragment>
            <Hero />
            <section className="section-items">
                <ItemList status={status} error={error} items={recentItems} isCollection={'collection'} />
            </section>
        </Fragment>
    );
};

export default Home;

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useHttp from '../hooks/use-http';
import { getItem } from '../lib/api';
import { getAllItems } from '../lib/api';
import LoadingSpinner from '../component/UI/LoadingSpinner';

import ItemView from '../component/item/ItemView';
import Notfound from './NotFound';
import ItemList from '../component/item/ItemList';

const ItemDetail = () => {
    const params = useParams();

    const { sendRequest, status, data: item, error } = useHttp(getItem, true);

    const {
        sendRequest: sendOptionsRequest,
        status: optionStatus,
        data: optionItems,
        error: optionError,
    } = useHttp(getAllItems, true);

    useEffect(() => {
        // effect for sending the request to the database
        sendRequest(params.id);
    }, [sendRequest, params.id]);

    useEffect(() => {
        sendOptionsRequest('?type=road-bike&limit=4');
    }, [sendOptionsRequest, params.id]);

    if (status === 'pending') {
        return (
            <div className="centered">
                <LoadingSpinner />
            </div>
        );
    }

    if (status === 'invalid') {
        // if product is invalid
        return <Notfound />;
    }

    if (error) {
        return (
            <div className="centered">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <section className="section-items">
            <ItemView item={item.data} />
            <ItemList status={optionStatus} error={optionError} items={optionItems} isCollection={'optional'} />
        </section>
    );
};

export default ItemDetail;

import { useState } from 'react';

const useCollapsible = () => {
    const [isCollapse, setIsCollapse] = useState(false);

    const collapseHandler = () => {
        setIsCollapse((prevValue) => !prevValue);
    };

    return {
        isCollapse,
        collapseHandler,
    };
};

export default useCollapsible;

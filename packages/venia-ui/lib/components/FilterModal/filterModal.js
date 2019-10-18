import React, { useMemo } from 'react';
import { array, arrayOf, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal/useFilterModal';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import { Modal } from '../Modal';
import CurrentFilters from './CurrentFilters';
import FilterFooter from './FilterFooter';
import FilterBlock from './filterBlock';
import defaultClasses from './filterModal.css';

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterModal = props => {
    const { filters } = props;
    const { drawer, filterApi, filterState, handleClose } = useFilterModal();
    const classes = mergeClasses(defaultClasses, props.classes);
    const modalClass = drawer === 'filter' ? classes.root_open : classes.root;

    const filtersList = useMemo(
        () =>
            filters.map(item => {
                const { request_var: key } = item;
                const blockState = filterState.get(key);

                return (
                    <FilterBlock
                        key={key}
                        filterApi={filterApi}
                        filterState={blockState}
                        item={item}
                    />
                );
            }),
        [filterApi, filterState, filters]
    );

    return (
        <Modal>
            <aside className={modalClass}>
                <div className={classes.body}>
                    <div className={classes.header}>
                        <span className={classes.headerTitle}>
                            {'FILTER BY'}
                        </span>
                        <button onClick={handleClose}>
                            <Icon src={CloseIcon} />
                        </button>
                    </div>
                    <CurrentFilters
                        filterApi={filterApi}
                        filterState={filterState}
                    />
                    <ul className={classes.blocks}>{filtersList}</ul>
                </div>
                <FilterFooter filterApi={filterApi} filterState={filterState} />
            </aside>
        </Modal>
    );
};

FilterModal.propTypes = {
    classes: shape({
        blocks: string,
        body: string,
        header: string,
        headerTitle: string,
        root: string,
        root_open: string
    }),
    filters: arrayOf(
        shape({
            request_var: string,
            items: array
        })
    )
};

export default FilterModal;

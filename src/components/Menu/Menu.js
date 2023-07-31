import styles from './Menu.module.scss'
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import Popper from '~/components/Popper';
import MenuItem from './MenuItem';
import Header from './Header';
import { useState } from 'react';
import PropTypes from 'prop-types';


const cx = classNames.bind(styles)
const defaultFn = () => { }
function Menu({ children, items = [], hideOnClick = false, onChange = defaultFn }) {

    const [history, setHistory] = useState([{ data: items }])
    const current = history[history.length - 1]


    const renderItem = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children
            return <MenuItem key={index} data={item} onClick={() => {
                if (isParent) {
                    setHistory(prev => [...prev, item.children])
                } else {
                    onChange(item)
                }
            }} />
        })
    }

    const handleBack = () => {
        setHistory(prev => prev.slice(0, prev.length - 1))
    }


    const handleResetToFirstPage = () => {
        setHistory(prev => prev.slice(0, 1))
    }

    return (
        <Tippy
            offset={[12, 10]}
            delay={[0, 600]}
            interactive
            hideOnClick={hideOnClick}
            placement='bottom-end'
            render={attrs => (
                <div className={cx('menu-list')} tabIndex='-1' {...attrs}>
                    <Popper className={cx('menu-popper')}>
                        {history.length > 1 &&
                            <Header
                                title={current.title}
                                onBack={handleBack}
                            />}
                        <div className={cx('menu-body')}>{renderItem()}</div>
                    </Popper>
                </div>
            )}
            onHide={handleResetToFirstPage}
        >
            {children}
        </Tippy>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func
}

export default Menu;
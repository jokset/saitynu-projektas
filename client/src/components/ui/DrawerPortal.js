import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const DrawerContainer = styled.div`
    position: fixed;
    top: 0;
    background-color: rgba(0, 0, 0, .4);
    opacity: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    padding: 0 !important;
    overflow: hidden;
    transition: all .2s ease-in-out;
    pointer-events: none;

    & > .columns {
        margin: 0 !important;

        & > .column {
            padding: 0;
        }
    }

    &.is-active {
        opacity: 1;
        pointer-events: unset;
    }
`;

const StyledDrawer = styled.div`
    background-color: #fff;
    height: 100vh;
    overflow-y: scroll;
    box-shadow: -10px 0px 20px rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition: all .2s ease-in-out;

    & > .header {
        font-weight: bold;
        padding: .4rem;
        position: sticky;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    }

    & > .content {
        padding: 1rem;
    }

    &.is-active {
        transform: translateX(0);
    }
`;

const DrawerPortal = ({ title, isOpen, children, onClose = () => null }) => {
    const [drawerState, setDrawerState] = useState(isOpen);

    useEffect(() => {
        setDrawerState(isOpen);
    }, [isOpen]);

    useEffect(() => {
        const closeDrawer = function(e) {
            if (e.target !== this) return;

            onClose();
            setDrawerState(false);
        }

        const eventTarget = document.body.querySelector('.drawer .columns');
        if (drawerState) {
            document.body.classList.add('hide-overflow');
            if (eventTarget) eventTarget.addEventListener('click', closeDrawer);
        }
        else {
            document.body.classList.remove('hide-overflow');
        }

        return () => eventTarget ? eventTarget.removeEventListener('click', closeDrawer) : null;
    }, [drawerState, onClose])

    return createPortal(
        <DrawerContainer className={`drawer container is-fluid ${drawerState ? 'is-active' : ''}`}>
            <div className="columns">
                <StyledDrawer
                    className={`column is-4-desktop is-offset-8-desktop is-6-tablet is-offset-6-tablet ${drawerState ? 'is-active' : ''}`}>
                    <div className="header">
                        <span className="is-flex is-align-items-center">
                            <button className="button is-white ml-1 mr-3" onClick={() => {setDrawerState(false); onClose()}}>
                                <span class="icon is-small">
                                    <span className="material-icons">arrow_back</span>
                                </span>
                            </button>
                            {title}
                        </span>
                    </div>
                    <div className="content">
                        {children}
                    </div>
                </StyledDrawer>
            </div>
        </DrawerContainer>,
        document.querySelector('#root')
    );
}

export default DrawerPortal;
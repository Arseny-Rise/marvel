import React, { useState, useEffect, useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
// import setContent from '../../utils/setContent';

const setContent = (process, Component, data, newHeroesLoading) => {
    // console.log(process, Component, data);
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return newHeroesLoading ? <Component data={data} /> : <Spinner />;
        case 'confirmed':
            return <Component data={data} />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state');
    }
};

const CharList = (props) => {
    const { getAllCharacters, process, setProcess } = useMarvelService();

    const [heroes, setHeroes] = useState([]);
    const [offset, setOffset] = useState(260);
    const [newHeroesLoading, setNewHeroesLoading] = useState(true);
    const [charEnded, setCharEnded] = useState(false);

    useEffect(() => {
        charsLoading(offset, true);
    }, []);

    const charsLoading = (offset, initial) => {
        initial ? setNewHeroesLoading(false) : setNewHeroesLoading(true);
        let ended = false;

        getAllCharacters(offset)
            .then((newHeroes) => {
                if (newHeroes.length < 9) {
                    ended = true;
                }

                setOffset((offset) => offset + 9);
                setNewHeroesLoading((newHeroesLoading) => false);
                setHeroes((heroes) => [...heroes, ...newHeroes]);
                setCharEnded((charEnded) => ended);
            })
            .then(() => setProcess('confirmed'));
    };

    const newItemsLoading = () => {
        charsLoading(offset);
    };

    const focusOnItem = (itemIdx) => {
        console.log(itemIdx);
        itemsRef.current.forEach((ref, idx) => {
            itemsRef.current[idx].classList.remove('char__item_selected');
        });
        itemsRef.current[itemIdx].classList.add('char__item_selected');
    };

    const itemsRef = useRef([]);

    return (
        <div className="char__list">
            {setContent(
                process,
                View,
                { heroes, propsParent: props, refs: itemsRef, focusOnItem },
                newHeroesLoading
            )}

            <button
                onClick={() => {
                    newItemsLoading();
                }}
                disabled={newHeroesLoading}
                style={{ display: charEnded ? 'none' : 'block' }}
                className="button button__main button__long"
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

const View = ({ data }) => {
    // console.log(data);
    // console.log('RENDER VIEW charList');

    const { heroes, propsParent, refs, focusOnItem } = data;

    let timeout = 100;

    const heroesView = (
        <TransitionGroup component={'ul'} className="char__grid">
            {heroes.map((item, i) => {
                const { id, thumbnail, name, imageContain } = item;
                timeout = timeout + 100;
                return (
                    <CSSTransition timeout={timeout} classNames="char__item">
                        {(state) => {
                            timeout = 100;
                            return (
                                <li
                                    key={id}
                                    ref={(el) => (refs.current[i] = el)}
                                    onClick={(e) => {
                                        focusOnItem(i);
                                        propsParent.onCharSelected(item.id);
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === ' ' || e.key === 'Enter') {
                                            focusOnItem(i);
                                            propsParent.onCharSelected(item.id);
                                        }
                                    }}
                                    className="char__item char__item_selectedd"
                                    tabIndex={0}
                                >
                                    <img src={thumbnail} style={imageContain} alt="abyss" />
                                    <div className="char__name">
                                        {name.length < 26 ? name : name.slice(0, 26) + '...'}
                                    </div>
                                </li>
                            );
                        }}
                    </CSSTransition>
                );
            })}
        </TransitionGroup>
    );

    return heroesView;
};

export default CharList;

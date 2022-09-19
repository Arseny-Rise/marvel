import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const setContent = (process, Component, newHeroesLoading) => {
    console.log(process, Component);
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return newHeroesLoading ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state');
    }
};

const ComicsList = () => {
    const { getComics, process, setProcess } = useMarvelService();
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newHeroesLoading, setNewHeroesLoading] = useState(true);

    useEffect(() => {
        setNewHeroesLoading((newHeroesLoading) => false);
        getComics(offset)
            .then((comics) => {
                setComics(comics);

                setOffset((offset) => offset + 8);
            })
            .then(() => {
                setProcess('confirmed');
                // setNewHeroesLoading((newHeroesLoading) => false);
            });
    }, []);

    const comicsItems = () => (
        <ul className="comics__grid">
            {comics.map((item, i) => {
                const { id, title, thumbnail, prices } = item;
                const price = prices[0].price;
                return (
                    <li key={id} className="comics__item">
                        <Link to={`/comics/${id}`}>
                            <img
                                src={thumbnail.path + '.' + thumbnail.extension}
                                alt=""
                                className="comics__item-img"
                            />
                            <div className="comics__item-name">{title}</div>
                            <div className="comics__item-price">
                                {price ? price + ' $' : 'Not for sale'}
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );

    const newComics = () => {
        setNewHeroesLoading((newHeroesLoading) => true);
        getComics(offset)
            .then((comics) => {
                setComics((newComics) => [...newComics, ...comics]);

                setOffset((offset) => offset + 8);
                setNewHeroesLoading((newHeroesLoading) => false);
            })
            .then(() => setProcess('confirmed'));
    };

    return (
        <div className="comics__list">
            {setContent(process, () => comicsItems(), newHeroesLoading)}
            <button
                className="button button__main button__long"
                onClick={() => newComics()}
                disabled={newHeroesLoading}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
};

export default ComicsList;

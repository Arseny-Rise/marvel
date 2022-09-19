import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const { getCharacter, clearError, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateCharInfo();
    }, []);

    useEffect(() => {
        updateCharInfo();
    }, [props.charId]);

    const updateCharInfo = () => {
        const { charId } = props;
        if (!charId) return false;

        clearError();
        getCharacter(charId).then(onCharLoaded);
    };

    const onCharLoaded = (char) => {
        setChar(char);
        setProcess('confirmed');
    };

    // const skeleton = char || loading || error ? null : <Skeleton />;
    // const errorMessage = error ? <ErrorMessage /> : null;
    // const spinner = loading ? <Spinner /> : null;
    // const content = !(loading || error || !char) ? <View char={char} /> : null;

    return <div className="char__info">{setContent(process, View, char)}</div>;
};

const View = ({ data }) => {
    const { name, description, thumbnail, homepage, wiki, imageContain, comics } = data;
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} style={imageContain} alt="abyss" />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            {comics.length ? <div className="char__comics">Comics:</div> : null}
            <ul className="char__comics-list">
                {comics.map((item, i) => {
                    if (i >= 10) return false;

                    return (
                        <li key={i} className="char__comics-item">
                            {item.name}
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

CharInfo.propTypes = {
    charId: PropTypes.number,
};

export default CharInfo;

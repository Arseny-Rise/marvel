import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
    const { request, clearError, process, setProcess } = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=d0c395513a2e96e945b82a35ef5f3ebb';
    const _offset = 210;

    const getAllCharacters = async (offset = _offset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    };

    const getComics = async (issueNumber = 10, offset = 0, limit = 8) => {
        const res = await request(
            `${_apiBase}comics?issueNumber=${issueNumber}&limit=${limit}&offset=${offset}&${_apiKey}`
        );
        return res.data.results;
    };

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    };

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results;
    };

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount
                ? `${comics.pageCount} p.`
                : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available',
        };
    };

    const _transformCharacter = (char) => {
        let imageContain = {
                objectFit: 'cover',
            },
            description = char.description ? char.description : 'Description comming soon';
        if (description.length > 210) {
            description = description.slice(0, 210) + '...';
        }
        if (char.thumbnail.path.indexOf('image_not_available') !== -1) {
            imageContain = {
                objectFit: 'contain',
            };
        }

        return {
            id: char.id,
            name: char.name,
            description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            imageContain,
            comics: char.comics.items,
        };
    };

    return {
        process,
        setProcess,
        getAllCharacters,
        getCharacter,
        clearError,
        getComics,
        getComic,
        getCharacterByName,
    };
};

export default useMarvelService;

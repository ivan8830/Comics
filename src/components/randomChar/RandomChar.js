import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';


const RandomChar = () => {

    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timerId);
        }
    }, [])


    const onCharLoaded = (char) => {
        setChar(char);
    }

/*     const onCharLoading = () => { //больще не нужны так как создали свой хук, который делает тоже самое
        setLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    } */

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000)) + 1011000;
        //onCharLoading(); //дословно, перед тем как отправить запрос, я запускаю спиннер, что бы быть уверенными что мы именно нажали на кнопку, а не мимо
        getCharacter(id)
            .then(onCharLoaded)
            //.catch(onError) больще не нужны так как создали свой хук, который делает тоже самое
    }

        //Что бы в верстку не пихать кучу условий, их записывают в отдельные переменные
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

/*         if (loading) { //первый вариант
            return <Spinner/>
        } */


        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                {/* {loading ? <Spinner/> : <View char={char}/>} первый вариант */} {/* иногда разрабы в пределах одного компонента разделяют его. если там надо сделать загрузку */}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    let imgStyle = { 'objectFit': 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;
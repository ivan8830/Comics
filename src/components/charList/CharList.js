import { useState, useEffect, useRef } from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

const {loading, error, getAllCharacters} = useMarvelService();

    //useEffect запускается после рендера всего, поэтому все функции уже успели инициализироваться и ими можно пользоваться
    useEffect(() => {
        onRequest(offset, true);
    }, []) //при пустом массиве функция отработает один раз при создании


    const onRequest = (offset, initial) => { //метод который отвечает за запрос на сервер, для дозагрузки картинок по нажатию на кнопку
        initial ? setNewItemLoading(false) : setNewItemLoading(true); // когда добавляем карточки на страницу, чтоб все карточки не заменялись на спинер
        getAllCharacters(offset)
            .then(onCharListLoaded)
            //.catch(onError) свой Хук
    }

    const onCharListLoaded = (newCharList) => { //отвечает за успешеую загрузку
        let ended = false;
        if(newCharList.length < 9) {//Проверяем есть у нас еще карточки для загрузки или нет, если нет то больше не грузим и удаляем кнопку
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]); //мы прописываем через коллбек функцию,  потому что нам важно предыдущее состояние объекта, иначе можно просто значение записать
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

/*     const onError = () => {
        setError(true);
        setLoading(loading => false);
    } */

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }


    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li 
                        className="char__item"
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}
                        >
                        <img 
                            src={item.thumbnail} 
                            alt={item.name} 
                            style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemLoading ? <Spinner/> : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired //проверяем что к нам вообще пришло данное свойство
}

export default CharList;
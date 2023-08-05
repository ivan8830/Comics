import img from './error.gif'

const ErrorMessage = () => {
    return (
        //<img src={process.env.PUBLIC_URL + '/error.gif'} /> //если нам надо обратиться к папке publik к статичному объекту, используется редко
        <img style={{display: 'block', width: '250px', height: '250px', objectFit: 'contain', margin: '0 auto'}} src={img} alt="Error"/>
    
    )
}

export default ErrorMessage;
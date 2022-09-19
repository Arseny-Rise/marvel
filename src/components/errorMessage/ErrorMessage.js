import error from './error.gif';

const ErrorMessage = () => {
    return (
        <img
            src={error}
            style={{
                display: 'block',
                width: '250px',
                height: '250px',
                objectFit: 'contain',
                margin: '0 auto',
            }}
            alt=""
        />
    );
};

export default ErrorMessage;

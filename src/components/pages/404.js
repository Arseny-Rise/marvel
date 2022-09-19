import ErrorMessage from '../errorMessage/ErrorMessage';
import { Link } from 'react-router-dom';

const Page404 = () => {
    return (
        <div>
            <ErrorMessage />
            <br />
            <Link to="/">Back to home page</Link>
        </div>
    );
};

export default Page404;

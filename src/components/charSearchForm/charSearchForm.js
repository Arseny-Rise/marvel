import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';

import './charSearchForm.scss';

const CharSearchForm = () => {
    const { getCharacterByName, process, setProcess } = useMarvelService();

    const [char, setChar] = useState(null);

    const charSearchContent =
        process === 'confirmed' && char.length > 0 ? (
            <div className="char__search-wrapper">
                <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                    <div className="inner">To page</div>
                </Link>
            </div>
        ) : char && char.length === 0 ? (
            <div className="char__search-error">
                The character was not found. Check the name and try again
            </div>
        ) : null;

    const sendForm = (name) => {
        getCharacterByName(name)
            .then((res) => {
                setChar(res);
            })
            .then(() => setProcess('confirmed'));
    };

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{ charName: '' }}
                validationSchema={Yup.object({
                    charName: Yup.string()
                        .min(2, 'Must be 2 characters or more')
                        .required('This field is required'),
                })}
                onSubmit={(values, action) => {
                    sendForm(values.charName);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">
                        Or find a character by name:
                    </label>
                    <div className="char__search-wrapper">
                        <Field name="charName" id="charName" type="text" placeholder="Enter name" />
                        <button
                            type="submit"
                            className="button button__main"
                            disabled={process === 'loading'}
                        >
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage name="charName">
                        {(msg) => <div className="char__search-error">{msg}</div>}
                    </FormikErrorMessage>
                    {charSearchContent}
                </Form>
            </Formik>
        </div>
    );
};

export default CharSearchForm;

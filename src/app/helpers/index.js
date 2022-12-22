import { generate } from 'shortid';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';

export const themeColor = 'mainTheme';



export const generateInfoMessage = (msg) => {
    return { id: generate(), msg };
};

export const generateErrorMessage = (datar) => {
    return { id: generate(), msg: `Error with ${data.action}. Error message: ${data.errorMessage}` };
};

export const stringToLink = (to, text, textStyle) => {
    return (
        <Link
            style={{
                width: '100%',
                display: 'block',
                fontWeight: textStyle === 'bold' ? 'bold' : 'inherit'
            }}
            to={to}
        >
            {text}
        </Link>
    );
};

export function useQuery() {
    const parsed = queryString.parse(useLocation().search);
    return parsed;
}

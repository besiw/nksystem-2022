import { generate } from 'shortid';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';

export const themeColor = 'mainTheme';

interface IErrorMessageGenerator {
    action: string;
    errorMessage: string;
}

export const generateInfoMessage = (msg: string) => {
    return { id: generate(), msg };
};

export const generateErrorMessage = (data: IErrorMessageGenerator) => {
    return { id: generate(), msg: `Error with ${data.action}. Error message: ${data.errorMessage}` };
};

export const stringToLink = (to: string, text: string, textStyle: 'bold' | 'simple' = 'bold'): JSX.Element => {
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

import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonLinkProps } from '../../lib/interfaces';

const style = 'hover:bg-blue-400 bg-blue-600 text-white p-2 rounded text-sm md:text-base';

const ButtonLink: React.FC<ButtonLinkProps> = ({ text, path, classes = '' }) => (
    <Link
        className={`${style} ${classes}`}
        to={path}
    >
        {text}
    </Link>
);

export default ButtonLink;

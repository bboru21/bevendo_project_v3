import Link from 'next/link';
import classNames from 'classnames';
import styles from './Card.module.scss';

const Container = ({ href, className: classNameProp, children }) => {
    if (href) {
        return <Link href={href} className={classNames(styles.container, classNameProp)}>{children}</Link>
    }
    return <div className={classNames(styles.container, classNameProp)}>{children}</div>;
};
const Card = ({ href, title}) => (
    <Container href={href}>
        <>
            <h3>{title}</h3>
            <p>
                [DESCRIPTION]
            </p>
        </>
    </Container>     
)

export default Card;
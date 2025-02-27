import Link from 'next/link';
import classNames from 'classnames';
import css from './Card.module.scss';
import Image from 'next/image';
const Container = ({ href, className: classNameProp, children }) => {
    if (href) {
        return (
            <Link href={href} legacyBehavior>
                <a className={classNames(css.container, css.link, classNameProp)}>
                    {children}
                </a>    
            </Link>
        );
    }
    return <div className={classNames(css.container, classNameProp)}>{children}</div>;
};
const Card = ({ href, title, image, className: classNameProp}) => (
    <Container href={href} className={classNameProp}>
        <div className={css.innerContainer}>
            <div className={css.content}>
                <h3>{title}</h3>
                
            </div>

            {image && <Image src={`${process.env.NEXT_PUBLIC_API_URL}${image}`} alt={title} priority={false} layout="fill" className={css.image} />}

        </div>
    </Container>     
)

export default Card;
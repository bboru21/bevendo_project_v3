import Link from 'next/link';
import classNames from 'classnames';
import css from './Card.module.scss';
import Image from 'next/image';
const Container = ({ href, className: classNameProp, children, ...restProps }) => {
    if (href) {
        return (
            <Link href={href} legacyBehavior {...restProps}>
                <a className={classNames(css.container, css.link, classNameProp)}>
                    {children}
                </a>    
            </Link>
        );
    }
    return <div className={classNames(css.container, classNameProp)} {...restProps}>{children}</div>;
};
const Card = ({ href, title, image, zoom=false, className: classNameProp, ...restProps}) => (
    <Container 
        href={href} 
        className={classNames(classNameProp, {
            [css.zoom]: zoom,
        })}
        {...restProps}
    >
        <div className={css.innerContainer}>
            <div className={css.content}>
                <h3>{title}</h3>
                
            </div>

            {image && <Image src={`${process.env.NEXT_PUBLIC_API_URL}${image}`} alt={title} priority={false} layout="fill" className={css.image} />}

        </div>
    </Container>     
)

export default Card;
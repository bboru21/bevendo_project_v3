import css from './Heading.module.scss';
import classNames from 'classnames';

const Heading = ({
  text,
  subtext,
  button,
  className: classNameProp='',
}) => (
  <h1 className={classNames('display-5 fw-bold', css.heading, classNameProp)}>
      {text}
      { subtext && <small className={classNames("text-muted", "fs-5", css.small)}>{subtext}</small> }
      { button && button }
  </h1>
);

export default Heading;
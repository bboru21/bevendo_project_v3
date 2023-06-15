import css from './Heading.module.scss';
import classNames from 'classnames';

const Heading = ({
  text,
  subtext,
  button,
}) => (
  <h1 className='display-5 fw-bold'>
      {text}
      { subtext && <small className={classNames("text-muted", "fs-5", css.small)}>{subtext}</small> }
      { button && button }
  </h1>
);

export default Heading;
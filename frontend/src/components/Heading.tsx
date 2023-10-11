import css from './Heading.module.scss';
import classNames from 'classnames';

const Heading = ({
  text,
  subtext,
  button,
}: Props) => (
  <h1 className='display-5 fw-bold'>
      {text}
      { subtext && <small className={classNames("text-muted", "fs-5", css.small)}>{subtext}</small> }
      { button && button }
  </h1>
);

interface Props {
  text: string;
  subtext?: string;
  button?: any;
}

export default Heading;
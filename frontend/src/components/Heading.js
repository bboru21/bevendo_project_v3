const Heading = ({
  text,
  subtext,
  button,
}) => (
  <h1 className='display-5 fw-bold'>
      {text}
      { subtext && <small className="text-muted fs-5 ms-2">{subtext}</small> }
      { button && button }
  </h1>
);

export default Heading;
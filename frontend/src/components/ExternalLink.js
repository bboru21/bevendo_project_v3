import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noreferrer">
    <>
      {children}
      <FontAwesomeIcon icon={faExternalLink} className="ms-1" size="1x" />
    </>
  </a>
);

export default ExternalLink;
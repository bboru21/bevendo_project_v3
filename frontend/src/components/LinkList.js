import Link from 'next/link';

const LinkList = ({ title, links }) => {
  return links.length === 0 ? <></> : (
      <div>
          <p className="fs-5 fw-bold">{title}:</p>
          {links.map((item) => (
              <Link key={item.urlname} href={item.urlname} legacyBehavior>
                  <a className="btn btn-primary me-2">{item.name}</a>
              </Link>
          ))}
      </div>
  );
};

export default LinkList;
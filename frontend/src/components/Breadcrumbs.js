import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useRouter } from 'next/router';

const Breadcrumbs = ({ breadcrumbs }) => {
  const router = useRouter();

  return (
    <div className="px-3 py-1">
      <Breadcrumb>
      {breadcrumbs.map( (b, i) => (
        <Breadcrumb.Item key={i} href={b.href} active={b.active || (router.pathname === b.href)}>{b.text}</Breadcrumb.Item>
      ))}
      </Breadcrumb>
    </div>
  );
}

export default Breadcrumbs;
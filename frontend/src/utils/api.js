import cookie from 'cookie';
import { API_URL } from '../config/index';

/*
  Performs a GET request to the API endpoint, checking to ensure the access cookie is present.
  Commonly used within getServerSideProps.
*/
export const performAPIGet = async (urlSegment, req) => {

  const cookies = cookie.parse(req.headers.cookie ?? '');
  const access = cookies.access ?? false;

  if (access===false) {
    // don't bother hitting the API
    return new Response('Unauthorized', { status: 403, statusText: 'User unauthorized to load page data' })
  }

  const res = await fetch(`${API_URL}/api/v1${urlSegment}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${access}`,
    },
  });

  return res;
}

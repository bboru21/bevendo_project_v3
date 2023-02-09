import { API_URL } from '../../../config/index';
import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'GET') {

    const cookies = cookie.parse(req.headers.cookie ?? '');
    const refresh = cookies.refresh ?? false;

    if (refresh === false) {
      return res.status(401).json({
        error: 'User unauthorized to make this request',
      });
    }

    const body = JSON.stringify({
      refresh,
    });

    try {
      const apiRes = await fetch(`${API_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: body
      });

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        res.setHeader('Set-Cookie', [
          cookie.serialize(
            'access', data.access, {
              'httpOnly': true,
              'secure': process.env.NODE_ENV !== 'development',
              'maxAge': 60 * 30, // 30 minutes, must match ACCESS_TOKEN_LIFETIME
              'sameSite': 'strict',
              'path': '/'
            }
          ),
          cookie.serialize(
            'refresh', data.refresh, {
              'httpOnly': true,
              'secure': process.env.NODE_ENV !== 'development',
              'maxAge': 60 * 60 * 24, // 1 day, must match REFRESH_TOKEN_LIFETIME 
              'sameSite': 'strict',
              'path': '/'
            }
          ),
        ]);

        return res.status(200).json({
          success: 'Refresh request successful',
        });
      } else {
        return res.status(apiRes.status).json({
          error: 'Failed to fulfill refresh request',
        });
      }
    } catch(error) {
      return res.status(500).json({
        error: 'Something went wrong when trying to fultill refresh request',
      });
    }

  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      error: `Method ${res.status} not allowed`,
    });
  }
}
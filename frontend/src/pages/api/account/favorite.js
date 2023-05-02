import cookie from 'cookie';
import { API_URL } from '../../../config/index';

const favorite = async (req, res) => {
  if (req.method === 'POST') {

    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
          error: 'User unauthorized to make this request',
      });
    }

    const { cocktail_id } = req.body;
    const body = JSON.stringify({
      cocktail_id,
    });

    try {
      const apiRes = await fetch(`${API_URL}/api/v1/favorite`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
        body: body,
      });

      const data = await apiRes.json();

      if (apiRes.status === 200 || apiRes.status === 201) {
        return res.status(apiRes.status).json({
          success: data.success,
          favorites: data.favorites,
        });
      } else {
        return res.status(apiRes.status).json({
          error: data.error,
        });
      }
    } catch(error) {
      return res.status(500).json({
        error: 'Something went wrong when trying to add a favorite'
      });
    }

  } else if (req.method === 'DELETE') {

    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
          error: 'User unauthorized to make this request',
      });
    }

    const { cocktail_id } = req.body;
    const body = JSON.stringify({
      cocktail_id,
    });

    try {
      const apiRes = await fetch(`${API_URL}/api/v1/favorite`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
        body: body,
      });

      const data = await apiRes.json();

      if (apiRes.status === 200) {
        return res.status(apiRes.status).json({
          success: data.success,
          favorites: data.favorites,
        });
      } else {
        return res.status(apiRes.status).json({
          error: data.error,
        });
      }
    } catch(error) {
      return res.status(500).json({
        error: 'Something went wrong when trying to remove a favorite'
      });
    }

  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    return res.status(405).json({
        error: `Method ${req.method} not allowed`
    });
  }
};

export default favorite;
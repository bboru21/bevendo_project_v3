import cookie from 'cookie';
import { API_URL } from '../../../config/index';


const change_password = async (req, res) => {
  if (req.method === 'POST') {

    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access === false) {
      return res.status(401).json({
          error: 'User unauthorized to make this request',
      });
    }

    const {
      current_password,
      new_password,
      re_new_password,
    } = req.body;

    const body = JSON.stringify({
      current_password,
      new_password,
      re_new_password,
    });

    try {
      const apiRes = await fetch(
        `${API_URL}/api/account/change-password`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
          },
          body,
        }
      );

      const data = await apiRes.json();
      if (apiRes.status === 200) {
        return res.status(200).json({ 'success': data.success });
      } else {
        return res.status(apiRes.status).json({
          'error': data.error,
        });
      }
    }
    catch(error) {
      return res.status(500).json({
        'error': 'Something went wrong when changing password',
      })
    }

  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({'error': `Method ${req.method} not allowed`});
  }
};

export default change_password;
import { API_URL } from '../../../config/index';


const reset_password = async (req, res) => {
  if (req.method === 'POST') {
    const {
      password,
      re_password,
      uidb64,
      token,
    } = req.body;

    const body = JSON.stringify({
      password,
      re_password,
      uidb64,
      token,
    });

    try {
      const apiRes = await fetch(
        `${API_URL}/api/account/reset-password`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body,
        }
      );

      const data = await apiRes.json();
      if (apiRes.status === 200) {
        return res.status(200).json({
          'success': data.success,
        });
      } else {
        return res.status(apiRes.status).json({
          'error': data.error,
        })
      }
    } catch(error) {
      return res.status(500).json({
        'error': 'Something went wrong while attempting to reset password',
      })
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({'error': `Method ${req.method} not allowed`});
  }
};

export default reset_password;
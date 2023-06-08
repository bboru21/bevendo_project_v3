import { API_URL } from '../../../config/index';

const send_password_reset_email = async (req, res) => {

  if (req.method === 'POST') {

    const { email } = req.body;

    const body = JSON.stringify({
      email,
    });

    try {

      const apiRes = await fetch(
        `${API_URL}/api/account/send-password-reset-email`, {
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
        });
      }
    } catch (error) {
      return res.status(500).json({
        'error': 'Something went wrong when attempting to send password reset email',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({'error': `Method ${req.method} not allowed`})
  }

};

export default send_password_reset_email;
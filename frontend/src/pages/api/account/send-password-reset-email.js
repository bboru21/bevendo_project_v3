const send_password_reset_email = async (req, res) => {

  try {
    return res.status(200).json({
      'success': 'TODO replace with data.success',
    });
  } catch (error) {
    return res.status(500).json({
      'error': 'Something went wrong when attempting to send password reset email',
    });
  }

};

export default send_password_reset_email;
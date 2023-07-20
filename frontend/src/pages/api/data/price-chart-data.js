import cookie from 'cookie';
import { API_URL } from '../../../config/index';


const price_chart_data = async (req, res) => {
  if (req.method == 'GET') {
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const access = cookies.access ?? false;

    if (access) {
      const { pk } = req.query;

      const apiRes = await fetch(`${API_URL}/api/v1/price-chart-data/${pk}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
      });

      const data = await apiRes.json();
      if (apiRes.status === 200) {
          return res.status(200).json(data);
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
        error: `Method ${req.method} not allowed`,
    });
  }
};


export default price_chart_data;

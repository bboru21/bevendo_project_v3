import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// currently we need 11 to match ABC_PRODUCT_SIZES in abc_models.py
const _COLORS = [
  '#007bff', // primary
  '#6c757d', // secondary
  '#28a745', // success
  '#dc3545', // danger
  '#ffc107', // warning
  '#17a2b8', // info
  '#343a40', // dark
  '#ff8400', // non-bootstrap orange
  '#cc35dc', // non-bootstrap light purple
  '#28a745', // non-bootstrap dark purple
  '#1752b8', // non-bootstrap dark blue
];


const LineChart = ({ data: dataProp, title=null, }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  const data = {
    labels: dataProp.labels,
    datasets: dataProp.datasets.map((item, i) => ({
      ...item,
      borderWidth: 3,
      borderColor: _COLORS[i],
      backgroundColor: _COLORS[i],
    })),
  };

  return <Line options={options} data={data} />;
};


export default LineChart;

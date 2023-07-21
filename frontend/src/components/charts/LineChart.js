import { COLORS } from './constants';
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
      borderColor: COLORS[i],
      backgroundColor: COLORS[i],
    })),
  };

  return <Line options={options} data={data} />;
};


export default LineChart;

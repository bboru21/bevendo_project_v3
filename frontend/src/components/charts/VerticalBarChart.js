import { COLORS } from './constants';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);


const VerticalBarChart = ({ data: dataProp, title=null, }) => {
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
      backgroundColor: COLORS[i],
    })),
  };

  return <Bar options={options} data={data} />;
};


export default VerticalBarChart;

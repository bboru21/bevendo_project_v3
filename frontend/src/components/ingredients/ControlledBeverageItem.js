
import { useState } from 'react';
import { USDollar } from '../../utils/currency';
import ProConIcon from '../ProConIcon';
import ExternalLink from '../ExternalLink';
import PriceChartButton from '../PriceChartButton';
import LineChart from '../charts/LineChart';


const ControlledBeverageItem = ({ beverage }) => {

  const [chartData, setChartData ] = useState(null);

  const handleButtonClick = async (event, pk) => {

    const res = await fetch(`/api/data/price-chart-data?pk=${pk}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (res.status === 200) {
      const data = await res.json();
      setChartData(data);
    }
  };

  return (
    <>
      <h3>
          {beverage.name}
          <PriceChartButton
              className="ms-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#price-chart-container-${beverage.pk}`}
              aria-expanded="false"
              aria-controls={`price-chart-container-${beverage.pk}`}
              onClick={ (event) => { handleButtonClick(event, beverage.pk); }}
          />
      </h3>
      <div className="collapse" id={`price-chart-container-${beverage.pk}`}>
        {chartData && (
          <LineChart data={chartData} />
        )}
      </div>
      {beverage.current_prices.length > 0 && (
          <table className="table">
              <thead>
                  <tr>
                      <th scope="col">Size</th>
                      <th scope="col">Price</th>
                      <th scope="col" className="d-none d-sm-table-cell">
                          <span className="d-block d-md-none">PPL</span>
                          <span className="d-none d-md-block">Per Liter</span>
                      </th>
                      <th scope="col">
                          <span className="d-block d-md-none">Best</span>
                          <span className="d-none d-md-inline-block">Is Best Price?</span>
                      </th>
                      <th scope="col">
                          <span className="d-block d-md-none">Above Best</span>
                          <span className="d-none d-md-block">Amount Above Best Price</span>
                      </th>
                      <th scope="col">
                          <span className="d-block d-md-none">Sale</span>
                          <span className="d-none d-md-block">Is On-Sale?</span>
                      </th>
                  </tr>
              </thead>
              <tbody>
              {beverage.current_prices.map(p => (
                  <tr key={p.pk}>
                      <td>
                          {p.url ? (<ExternalLink href={p.url}>{p.size}</ExternalLink>) : (<>{p.size}</>)}
                      </td>
                      <td>{USDollar.format(p.current_price)}</td>
                      <td className="d-none d-sm-table-cell">{USDollar.format(p.price_per_liter)}</td>
                      <td><ProConIcon isPro={p.is_best_price} /></td>
                      <td>{!p.is_best_price ? USDollar.format(p.amount_above_best_price) : '$0.00'}</td>
                      <td><ProConIcon isPro={p.is_on_sale} /></td>
                  </tr>
              ))}
              </tbody>
          </table>
      )}
    </>
  );
};

export default ControlledBeverageItem;
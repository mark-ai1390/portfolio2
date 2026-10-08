import { typography } from '../lib/typography';
import { crmBenchmark } from '../data/crm-benchmark';

export function CrmBenchmark() {
  return <div className="crm-benchmark" data-figma-node="306:102876">
    <table role="table">
      <caption>Бенчмаркинг — сравнение подходов retailCRM и 4sales</caption>
      <thead><tr><th scope="col">Критерий</th><th scope="col">retailCRM</th><th scope="col">4sales</th></tr></thead>
      <tbody>{crmBenchmark.map(row => <tr key={row.criterion} role="row">
        <th scope="row" role="rowheader">{typography(row.criterion)}</th><td role="cell" data-label="retailCRM">{typography(row.retail)}</td><td role="cell" data-label="4sales">{typography(row.sales)}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}

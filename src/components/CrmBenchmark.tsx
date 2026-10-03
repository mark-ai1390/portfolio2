import { crmBenchmark } from '../data/crm-benchmark';

export function CrmBenchmark() {
  return <div className="crm-benchmark" data-figma-node="306:102876">
    <table>
      <caption>Бенчмаркинг — сравнение подходов retailCRM и 4sales</caption>
      <thead><tr><th scope="col">Критерий</th><th scope="col">retailCRM</th><th scope="col">4sales</th></tr></thead>
      <tbody>{crmBenchmark.map(row => <tr key={row.criterion}>
        <th scope="row">{row.criterion}</th><td>{row.retail}</td><td>{row.sales}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}

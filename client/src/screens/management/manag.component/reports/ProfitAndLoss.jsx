import React from "react";

const ProfitAndLoss = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center">
        <i className="bi bi-graph-up-arrow"></i> Profit and Loss Report
      </h2>
      <table className="table table-bordered table-hover mt-4">
        <thead>
          <tr>
            <th>
              <i className="bi bi-card-text table-icon"></i>Description
            </th>
            <th>
              <i className="bi bi-currency-dollar table-icon"></i>Revenue
            </th>
            <th>
              <i className="bi bi-currency-exchange table-icon"></i>Expenses
            </th>
            <th>
              <i className="bi bi-calculator table-icon"></i>Net Profit
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sales</td>
            <td>$10,000</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Cost of Goods Sold</td>
            <td></td>
            <td>$4,000</td>
            <td></td>
          </tr>
          <tr>
            <td>Operating Expenses</td>
            <td></td>
            <td>$2,000</td>
            <td></td>
          </tr>
          <tr>
            <td>Miscellaneous Expenses</td>
            <td></td>
            <td>$500</td>
            <td></td>
          </tr>
          <tr>
            <td>Marketing</td>
            <td></td>
            <td>$1,000</td>
            <td></td>
          </tr>
          <tr>
            <td>Employee Salaries</td>
            <td></td>
            <td>$3,000</td>
            <td></td>
          </tr>
          <tr className="table-success">
            <td>
              <strong>Total</strong>
            </td>
            <td>
              <strong>$10,000</strong>
            </td>
            <td>
              <strong>$10,500</strong>
            </td>
            <td>
              <strong>-$500</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProfitAndLoss;

import React from 'react';

/**
 * SellerDataTable — accessible data table for seller pages.
 *
 * Columns: [{ key, label, render?(row) }]
 * Rows: array of objects
 */
const SellerDataTable = ({ columns, rows, emptyMessage, emptyAction }) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="seller-empty-state">
        <span className="seller-empty-state-icon">📭</span>
        <h3 className="seller-empty-state-title">{emptyMessage || 'No items found'}</h3>
        {emptyAction && (
          <a href={emptyAction.to} className="seller-btn-primary" aria-label={emptyAction.label}>
            {emptyAction.label}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="seller-data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id || row.id || row.name}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerDataTable;

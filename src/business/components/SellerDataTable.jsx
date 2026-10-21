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
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f0f2f2] dark:bg-[#131921] border-b border-gray-200 dark:border-gray-800">
            {columns.map((col) => (
              <th key={col.key} scope="col" className="px-4 py-2.5 text-[11px] font-bold text-[#0f1111] dark:text-gray-300 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs text-gray-800 dark:text-gray-200">
          {rows.map((row) => (
            <tr key={row._id || row.id || row.name} className="hover:bg-gray-50 dark:hover:bg-[#232f3e]/40 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
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

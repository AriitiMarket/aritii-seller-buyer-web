import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdRoute, MdInventory } from 'react-icons/md';
import { useProviderBatches } from '../hooks/useProviderBatches';
import {
  BATCH_STATUS,
  getBatchStatusLabel,
  getBatchStatusColor,
  shortReference,
  formatDeliveryTime,
  calculateBatchProgress,
  apiErrorMessage
} from '../utils/providerDeliveryHelpers';

/**
 * Batches - shows provider's assigned delivery batches for efficient route planning.
 */
const Batches = () => {
  const [page, setPage] = useState(1);
  const [acceptingId, setAcceptingId] = useState(null);
  const { batches, count, totalPages, loading, error, supported, acceptBatch } = useProviderBatches({ page, limit: 50 });

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleAccept = async (batchId) => {
    setAcceptingId(batchId);
    try {
      await acceptBatch(batchId);
    } catch {
      // The hook exposes the backend error in the page alert.
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-600 mt-1">Manage grouped delivery batches.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="animate-pulse text-gray-400">Loading batches...</div>
        </div>
      </div>
    );
  }

  if (!supported) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-600 mt-1">Manage grouped delivery batches.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800">
            <strong>Batch Management Not Available:</strong> Batch functionality is not currently supported by the delivery service. Use individual assignments instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
        <p className="text-gray-600 mt-1">
          {count} assigned batch{count !== 1 ? 'es' : ''}
        </p>
      </div>

      {error && <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">Could not load or update dispatch batches: {apiErrorMessage(error, 'Please retry.')}</div>}

      {batches.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <MdRoute className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No batches yet</h3>
          <p className="text-gray-500 mb-4">
            Delivery batches allow you to handle multiple orders efficiently. When batches are available, they will appear here.
          </p>
          <Link
            to="/provider/available-work"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
          >
            Browse Available Work
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Batch Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono text-gray-500">
                      {batch.reference || shortReference(batch.id)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBatchStatusColor(batch.status)}`}>
                      {getBatchStatusLabel(batch.status)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delivery Batch {batch.reference || shortReference(batch.id)}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MdInventory size={16} />
                      <span>{batch.count} order{batch.count > 1 ? 's' : ''}</span>
                    </div>
                    {batch.createdAt && (
                      <span>Created {formatDeliveryTime(batch.createdAt)}</span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {batch.assignments && batch.assignments.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{calculateBatchProgress(batch.assignments)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#75d04b] h-2 rounded-full transition-all"
                          style={{ width: `${calculateBatchProgress(batch.assignments)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 lg:min-w-[160px]">
                  <Link
                    to={`/provider/batches/${batch.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#75d04b] text-white font-semibold rounded-lg hover:bg-[#5ac12f] transition"
                  >
                    View Details
                  </Link>
                  {batch.status === BATCH_STATUS.AVAILABLE && (
                    <button
                      onClick={() => handleAccept(batch.id)}
                      disabled={acceptingId === batch.id}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      {acceptingId === batch.id ? 'Accepting…' : 'Accept Batch'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded border px-3 py-1.5 text-sm disabled:opacity-50">Previous</button>
            <button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="rounded border px-3 py-1.5 text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Batches;

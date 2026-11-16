const EmptyState = ({ title = 'Nothing here yet', description, action }) => (
  <div className="py-12 text-center">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    {description && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;

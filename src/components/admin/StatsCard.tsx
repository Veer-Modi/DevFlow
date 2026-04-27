interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3 mr-4 text-blue-600 dark:text-blue-300">
              {icon}
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate uppercase tracking-wider">
              {title}
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

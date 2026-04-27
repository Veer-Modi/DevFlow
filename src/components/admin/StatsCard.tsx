interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-[#171717] overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-[rgba(255,255,255,0.05)]">
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0 bg-[#10a37f]/10 dark:bg-[#10a37f]/20 rounded-md p-3 mr-4 text-[#10a37f] dark:text-[#10a37f]">
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

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Filter, BarChart2, MapPin, AlertTriangle } from 'lucide-react';

export default function TrafficMenu() {
  const pathname = usePathname();
  
  const menuItems = [
    {
      name: 'Overview',
      href: '/dashboard/traffic',
      icon: Car
    },
    {
      name: 'Advanced Filtering',
      href: '/dashboard/traffic/advanced-filters',
      icon: Filter
    },
    {
      name: 'Traffic Analysis',
      href: '/dashboard/traffic/analysis',
      icon: BarChart2
    },
    {
      name: 'Traffic Map',
      href: '/dashboard/traffic/map',
      icon: MapPin
    },
    {
      name: 'Incidents',
      href: '/dashboard/traffic/incidents',
      icon: AlertTriangle
    }
  ];
  
  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
        <div className="flex flex-wrap">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-2 m-1 rounded-md text-sm font-medium transition-colors
                ${pathname === item.href 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 
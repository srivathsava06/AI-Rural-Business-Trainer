"use client";

import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "@/lib/i18n";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    labelKey: "dashboard.title",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/business/new",
    labelKey: "business.createTitle",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    href: "/learn",
    labelKey: "dashboard.learning",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: "/progress",
    labelKey: "dashboard.progress",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r border-gray-100">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-sm border border-amber-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={isActive ? "text-amber-500" : "text-gray-400"}>
                  {item.icon}
                </span>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Bottom mentor hint */}
        <div className="mx-3 mb-3 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🙏</span>
            <span className="text-sm font-bold text-amber-800">
              {t("common.appName")}
            </span>
          </div>
          <p className="text-xs text-amber-600 leading-relaxed">
            {t("mentor.greeting")}
          </p>
        </div>
      </div>
    </aside>
  );
}

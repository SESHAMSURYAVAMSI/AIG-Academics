"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  Users,
  Calendar,
  Mic,
  Download,
  Link,
  HelpCircle,
  BarChart3,
  Building,
  Bell,
  Phone,
} from "lucide-react";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [openCommittee, setOpenCommittee] = useState(false);

  useEffect(() => {
    if (pathname.includes("committee")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenCommittee(true);
    }
  }, [pathname]);

const handleBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/dashboard");
  }
};

  const isActive = (path: string) =>
    pathname === `/dashboard/events/${id}/${path}`;

  const menu = [
    { name: "Agenda", path: "agenda", icon: Calendar },
    { name: "Speaker", path: "speaker", icon: Mic },
    { name: "Delegate", path: "delegate", icon: Users },
    { name: "Download", path: "download", icon: Download },
    { name: "Quicklink", path: "quicklink", icon: Link },
    { name: "Quiz", path: "quiz", icon: HelpCircle },
    { name: "Polls", path: "polls", icon: BarChart3 },
    { name: "Exhibitors", path: "exhibitors", icon: Building },
    { name: "Push Message", path: "push-message", icon: Bell },
    { name: "Contact", path: "contact", icon: Phone },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r shadow-sm p-4 flex flex-col">
        
        {/* LOGO / TITLE */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Event Admin</h2>
          <p className="text-xs text-gray-500">Manage your event</p>
        </div>

        {/* BACK */}
        <button
          onClick={handleBack}
          className="mb-4 px-3 py-2 rounded-lg bg-gray-100 hover:bg-indigo-100 text-sm transition"
        >
          ← Back
        </button>

        {/* MENU */}
        <div className="space-y-1">
          
          {/* EVENT INFO */}
          <SidebarItem
            label="Event Info"
            icon={LayoutDashboard}
            active={pathname === `/dashboard/events/${id}`}
            onClick={() => router.push(`/dashboard/events/${id}`)}
          />

          {/* COMMITTEE */}
          <div>
            <div
              onClick={() => setOpenCommittee(!openCommittee)}
              className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3 text-sm">
                <Users size={16} />
                Committee
              </div>

              <motion.div
                animate={{ rotate: openCommittee ? 180 : 0 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </div>

            <AnimatePresence>
              {openCommittee && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-6 mt-1 space-y-1"
                >
                  <SidebarItem
                    label="Committee Type"
                    active={isActive("committee/type")}
                    onClick={() =>
                      router.push(`/dashboard/events/${id}/committee/type`)
                    }
                  />

                  <SidebarItem
                    label="Committee Members"
                    active={isActive("committee/members")}
                    onClick={() =>
                      router.push(`/dashboard/events/${id}/committee/members`)
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* OTHER MENU */}
          {menu.map((item) => (
            <SidebarItem
              key={item.name}
              label={item.name}
              icon={item.icon}
              active={isActive(item.path)}
              onClick={() =>
                router.push(`/dashboard/events/${id}/${item.path}`)
              }
            />
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}

/* 🔥 REUSABLE SIDEBAR ITEM */
function SidebarItem({
  label,
  icon: Icon,
  active,
  onClick,
}: any) {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition
        ${active ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-100"}
      `}
    >
      {/* ACTIVE LEFT BAR */}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r"
        />
      )}

      {Icon && <Icon size={16} />}
      {label}
    </div>
  );
}
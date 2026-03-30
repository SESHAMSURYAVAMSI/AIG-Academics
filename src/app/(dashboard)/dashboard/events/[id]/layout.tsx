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
  Link as LinkIcon,
  HelpCircle,
  BarChart3,
  Building,
  Bell,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "lucide-react";


/* ================= TYPES ================= */

type SidebarItemProps = {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
};

type DropdownMenuItemProps = {
  label: string;
  icon: LucideIcon;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

type SubItemProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

/* ================= COMPONENT ================= */

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();

  const [openCommittee, setOpenCommittee] = useState(false);
  const [openExhibitors, setOpenExhibitors] = useState(false);
  const [openAgenda, setOpenAgenda] = useState(false);
  const [openSpeaker, setOpenSpeaker] = useState(false);

  /* ================= AUTO OPEN DROPDOWNS ================= */

  useEffect(() => {
    if (!pathname) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenCommittee(pathname.includes("committee"));
    setOpenExhibitors(pathname.includes("exhibitors"));
    setOpenAgenda(pathname.includes("agenda"));
  }, [pathname]);

  const isActive = (path: string) =>
    pathname === `/dashboard/events/${id}/${path}`;

  /* ================= UI ================= */

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-72 h-screen sticky top-0 bg-white/80 backdrop-blur border-r shadow-sm p-4 flex flex-col overflow-y-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Event Admin</h2>
          <p className="text-xs text-gray-500">Manage your event</p>
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 px-3 py-2 rounded-lg bg-gray-100 hover:bg-indigo-100 text-sm transition"
        >
          ← Back
        </button>

        {/* MENU */}
        <div className="space-y-1">
          {/* 🔥 NEW EVENT PAGE */}
          <SidebarItem
            label="Event"
            icon={LayoutDashboard}
            active={pathname === `/dashboard/events/${id}`}
            onClick={() => router.push(`/dashboard/events/${id}`)}
          />

          {/* EVENT INFO*/}
          <SidebarItem
            label="Event Info"
            icon={LayoutDashboard}
            active={pathname === `/dashboard/events/${id}/event-info`}
            onClick={() => router.push(`/dashboard/events/${id}/event-info`)}
          />

          {/* COMMITTEE */}
          <DropdownMenuItem
            label="Committee"
            icon={Users}
            open={openCommittee}
            setOpen={setOpenCommittee}
          >
            <SubItem
              label="Committee Type"
              active={isActive("committee/type")}
              onClick={() =>
                router.push(`/dashboard/events/${id}/committee/type`)
              }
            />
            <SubItem
              label="Committee Members"
              active={isActive("committee/members")}
              onClick={() =>
                router.push(`/dashboard/events/${id}/committee/members`)
              }
            />
          </DropdownMenuItem>

          {/* AGENDA */}
          <DropdownMenuItem
            label="Agenda"
            icon={Calendar}
            open={openAgenda}
            setOpen={setOpenAgenda}
          >
            <SubItem
              label="Session Date"
              active={isActive("agenda/session-date")}
              onClick={() =>
                router.push(`/dashboard/events/${id}/agenda/session-date`)
              }
            />
            <SubItem
              label="Track"
              active={isActive("agenda/track")}
              onClick={() =>
                router.push(`/dashboard/events/${id}/agenda/track`)
              }
            />
            <SubItem
              label="Session Details"
              active={isActive("agenda/session-details")}
              onClick={() =>
                router.push(`/dashboard/events/${id}/agenda/session-details`)
              }
            />
          </DropdownMenuItem>

          {/* Speaker*/}
          <DropdownMenuItem
            label="Speaker"
            icon={Mic}
            open={openSpeaker}
            setOpen={setOpenSpeaker}
          >
            <SubItem
              label="Speaker Type"
              active={isActive("speaker/type")}
              onClick={() =>
                router.push(`/dashboard/events/${id}/speaker/type`)
              }
            />
            <SubItem
              label="Speaker Members"
              active={isActive("speaker/members")}
              onClick={() =>
                router.push(`/dashboard/events/${id}/speaker/members`)
              }
            />
          </DropdownMenuItem>

          {/* delegate*/}

          <SidebarItem
            label="Delegate"
            icon={Users}
            active={isActive("delegate")}
            onClick={() => router.push(`/dashboard/events/${id}/delegate`)}
          />

          {/* Download*/}

          <SidebarItem
            label="Download"
            icon={Download}
            active={pathname === `/dashboard/events/${id}/downloads`}
            onClick={() => router.push(`/dashboard/events/${id}/downloads`)}
          />

          {/* Quicklink*/}
          <SidebarItem
            label="Quicklinks"
            icon={Link}
            active={pathname === `/dashboard/events/${id}/quicklinks`}
            onClick={() => router.push(`/dashboard/events/${id}/quicklinks`)}
          />

          {/* Quiz*/}

          <SidebarItem
            label="Quiz"
            icon={HelpCircle}
            active={isActive("quiz")}
            onClick={() => router.push(`/dashboard/events/${id}/quiz`)}
          />

          {/* Polls*/}

          <SidebarItem
            label="Polls"
            icon={BarChart3}
            active={isActive("polls")}
            onClick={() => router.push(`/dashboard/events/${id}/polls`)}
          />

          {/* EXHIBITORS */}
          <DropdownMenuItem
            label="Exhibitors"
            icon={Building}
            open={openExhibitors}
            setOpen={setOpenExhibitors}
          >
            <SubItem
              label="Exhibitor Type"
              active={isActive("exhibitors/type")}
              onClick={() =>
                router.push(`/dashboard/events/${id}/exhibitors/type`)
              }
            />
            <SubItem
              label="Exhibitor Members"
              active={isActive("exhibitors/members")}
              onClick={() =>
                router.push(`/dashboard/events/${id}/exhibitors/members`)
              }
            />
          </DropdownMenuItem>

          {/* Push message*/}

          <SidebarItem
            label="Push Message"
            icon={Bell}
            active={isActive("push-message")}
            onClick={() => router.push(`/dashboard/events/${id}/push-message`)}
          />

          {/* Contact*/}

          <SidebarItem
            label="Contact"
            icon={Phone}
            active={isActive("contact")}
            onClick={() => router.push(`/dashboard/events/${id}/contact`)}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 h-screen overflow-y-auto p-6">{children}</div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function SidebarItem({ label, icon: Icon, active, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition
      ${active ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-100"}`}
    >
      <Icon size={16} />
      {label}
    </div>
  );
}

function DropdownMenuItem({
  label,
  icon: Icon,
  open,
  setOpen,
  children,
}: DropdownMenuItemProps) {
  return (
    <div>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
      >
        <div className="flex items-center gap-3 text-sm">
          <Icon size={16} />
          {label}
        </div>

        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 mt-1 space-y-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubItem({ label, active, onClick }: SubItemProps) {
  return (
    <div
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm cursor-pointer ${
        active ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"
      }`}
    >
      {label}
    </div>
  );
}

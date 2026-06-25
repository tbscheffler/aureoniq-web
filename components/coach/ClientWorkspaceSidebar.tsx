import WorkspaceNavItem from "@/components/coach/WorkspaceNavItem";

export default function ClientWorkspaceSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  return (
    <aside className="rounded-3xl border border-slate-800 bg-[#111827] p-6">
      <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
        WORKSPACE
      </p>

      <nav className="mt-6 space-y-3">
        <WorkspaceNavItem
          label="Career Discovery"
          active={activeSection === "discovery"}
          onClick={() => setActiveSection("discovery")}
        />

        <WorkspaceNavItem
          label="AIQ Reports"
          active={activeSection === "aiq"}
          onClick={() => setActiveSection("aiq")}
        />

        <WorkspaceNavItem
          label="Coach Notes"
          active={activeSection === "notes"}
          onClick={() => setActiveSection("notes")}
        />

        <WorkspaceNavItem
          label="Meeting History"
          active={activeSection === "meetings"}
          onClick={() => setActiveSection("meetings")}
        />

        <WorkspaceNavItem
          label="Action Plan"
          active={activeSection === "actions"}
          onClick={() => setActiveSection("actions")}
        />
      </nav>
    </aside>
  );
}
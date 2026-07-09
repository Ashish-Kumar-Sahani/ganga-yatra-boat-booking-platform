import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  Shield,
  Ship,
  BadgePercent,
  Building2,
  Route,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function QuickActionsMenu({ open, onClose }: Props) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleAction = (path: string) => {
    onClose();
    navigate(path);
  };

  const actions = [
    {
      label: "Create Owner",
      path: "/admin/boat-owners",
      icon: Users,
      description: "Register a new boat owner account",
    },
    {
      label: "Create Authority",
      path: "/admin/authorities",
      icon: Shield,
      description: "Approve a new government city authority",
    },
    {
      label: "Add Boat",
      path: "/admin/boats",
      icon: Ship,
      description: "Provision a boat under Owner records",
    },
    {
      label: "Create Offer",
      path: "/admin/offers",
      icon: BadgePercent,
      description: "Publish promotional discount code",
    },
    {
      label: "Create City",
      path: "/admin/cities",
      icon: Building2,
      description: "Open ride operations in a new city",
    },
    {
      label: "Create Route",
      path: "/admin/routes",
      icon: Route,
      description: "Define a route between ghat terminals",
    },
  ];

  return (
    <div className="absolute left-0 top-16 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl z-50 animate-fade-in text-slate-800">
      <div className="px-3 py-2 border-b border-slate-50 mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <Plus size={14} className="text-blue-600" />
        <span>Quick Console Actions</span>
      </div>
      <div className="grid gap-0.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => handleAction(act.path)}
              className="flex items-start gap-3 rounded-xl p-2.5 text-left hover:bg-blue-50/50 transition cursor-pointer group"
            >
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
                <Icon size={14} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                  {act.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {act.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

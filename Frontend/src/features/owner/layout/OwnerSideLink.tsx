import { NavLink } from "react-router-dom";

type Props = {
  item: {
    label: string;
    path: string;
    icon: any;
  };
  onClick?: () => void;
};

export default function OwnerSideLink({
  item,
  onClick,
}: Props) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/owner"}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
            : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        }`
      }
    >
      <Icon size={18} />
      {item.label}
    </NavLink>
  );
}
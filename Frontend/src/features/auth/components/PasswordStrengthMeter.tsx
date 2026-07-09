interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const getStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-200", textColor: "text-slate-400" };

    const commonWeak = ["12345678", "password", "admin123", "qwerty", "123456789", "password123"];
    if (commonWeak.includes(pass.toLowerCase())) {
      return { score: 1, label: "Weak (Common Password)", color: "bg-red-500", textColor: "text-red-500" };
    }

    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) {
      return { score, label: "Weak", color: "bg-red-500", textColor: "text-red-500" };
    } else if (score === 3) {
      return { score, label: "Medium", color: "bg-amber-500", textColor: "text-amber-500" };
    } else if (score === 4) {
      return { score, label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600" };
    } else {
      return { score, label: "Very Strong", color: "bg-blue-600", textColor: "text-blue-600" };
    }
  };

  const { score, label, color, textColor } = getStrength(password);

  return (
    <div className="mt-2 space-y-1.5 w-full">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-400">Password Strength</span>
        <span className={`${textColor} font-bold transition-all duration-300`}>{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${score >= 1 ? color : "bg-slate-200"}`} />
        <div className={`h-full rounded-full transition-all duration-500 ${score >= 3 ? color : "bg-slate-200"}`} />
        <div className={`h-full rounded-full transition-all duration-500 ${score >= 4 ? color : "bg-slate-200"}`} />
        <div className={`h-full rounded-full transition-all duration-500 ${score >= 5 ? color : "bg-slate-200"}`} />
      </div>
      <p className="text-[10px] text-slate-400 leading-normal">
        Use 8+ characters with uppercase, lowercase, numbers, and symbols.
      </p>
    </div>
  );
}

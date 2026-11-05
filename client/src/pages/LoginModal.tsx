import { useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { AuthForm } from "../components/auth/AuthForm";
import type { User } from "../context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSuccess = (user: User, mode: "login" | "register") => {
    toast.success(mode === "login" ? `Welcome back, ${user.name.split(" ")[0]}!` : "Account created");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" className="relative bg-white rounded-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <AuthForm onSuccess={handleSuccess} compact />
      </div>
    </div>
  );
}

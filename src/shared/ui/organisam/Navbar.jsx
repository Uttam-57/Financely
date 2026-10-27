import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/hooks/firebase";
import { Routes } from "@/routes/routes";
import { Button } from "@/shared/ui";

export default function Navbar(){
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logoutUser();
        navigate(Routes.SIGNIN, { replace: true });
    };

    return (
        <header className="sticky top-0 z-30 shrink-0 min-h-16 bg-surface-raise text-text-2 shadow-sm flex items-center">
            <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
                    <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-contain" src="/logo.png" alt="Logo" />
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">Financely</h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-primary text-center leading-8 text-white font-medium shrink-0">
                            {(user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="hidden sm:block text-sm font-medium max-w-[120px] md:max-w-[180px] truncate" title={user?.displayName || "Account"}>
                            {user?.displayName || "Account"}
                        </p>
                    </div>
                    <Button 
                        type="button" 
                        onClick={handleLogout} 
                        className="bg-surface-card text-text-3 w-auto px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium hover:bg-gray-100 hover:text-text-1 shadow-none transition-colors"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
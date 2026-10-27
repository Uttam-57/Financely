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

    return(
        <header className="sticky top-0 z-30 shrink-0 h-16 bg-surface-raise text-text-2 px-12 items-center flex justify-between">
            <div className="flex justify-center items-center gap-4"><img className="h-12 w-12 rounded-lg " src="/logo.png" alt="Logo" /><h1 className="text-4xl font-semibold">Financely</h1></div>
            <div className="content-center flex items-center gap-3">
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-primary text-center leading-8 text-white font-medium">
                        {(user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                    </div>
                )}
                <div>
                    <p className="text-sm font-medium">{user?.displayName || "Account"}</p>
                </div>
                <Button 
                    type="button" 
                    onClick={handleLogout} 
                    className="bg-surface-card text-text-3 w-auto px-4 py-1.5 hover:bg-gray-200 hover:text-text-1"
                >
                    Logout
                </Button>
            </div>
        </header>
    );
}
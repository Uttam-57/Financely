export default function Footer() {

    return (
        <footer className="mt-auto shrink-0 bg-surface-raise text-text-2 border-t border-white/10">
            <div className="w-full max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-5 text-sm text-text-2">
                {/* Brand / Logo */}
                <span className="text-xl sm:text-2xl font-semibold tracking-tight">
                    Financely
                </span>

                {/* Essential Navigation */}
                <nav className="flex items-center gap-5 sm:gap-6 text-xs sm:text-sm">
                    <a href="#" className="hover:text-white/80 transition-colors">
                        Privacy
                    </a>
                    <a href="#" className="hover:text-white/80 transition-colors">
                        Terms
                    </a>
                    <a href="#" className="hover:text-white/80 transition-colors">
                        Contact
                    </a>
                </nav>

                {/* Copyright */}
                <p className="text-xs sm:text-sm opacity-80 text-center sm:text-right">
                    &copy; 2026 Financely. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
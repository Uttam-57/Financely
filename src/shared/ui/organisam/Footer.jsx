export default function Footer() {

    return (
        <footer className="h-24 shrink-0 bg-surface-raise text-text-2 border-t border-gray-100">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-text-2 sm:flex-row">
                {/* Brand / Logo */}
                <span className="text-2xl text-text-2 ">
                    Financely
                </span>

                {/* Essential Navigation */}
                <nav className="flex items-center gap-6">
                    <a href="#" className="hover:text-gray-900 transition-colors">
                        Privacy
                    </a>
                    <a href="#" className="hover:text-gray-900 transition-colors">
                        Terms
                    </a>
                    <a href="#" className="hover:text-gray-900 transition-colors">
                        Contact
                    </a>
                </nav>

                {/* Copyright */}
                <p className="text-s text-text-2">
                    &copy; 2026 Financely. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
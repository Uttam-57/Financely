import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/shared/ui/organisam/Navbar'
import Footer from '@/shared/ui/organisam/Footer'

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-surface-base">
            <Navbar />
            <main className="flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-5 md:p-6 lg:p-8 flex flex-col gap-6 md:gap-8 mb-4">
                <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading dashboard...</div>}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
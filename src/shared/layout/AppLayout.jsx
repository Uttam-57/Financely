import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/shared/ui/organisam/Navbar'
import Footer from '@/shared/ui/organisam/Footer'

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-surface-base">
            <Navbar />
            <main className="flex-1 flex flex-col p-5 gap-8 mb-2">
                <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading dashboard...</div>}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
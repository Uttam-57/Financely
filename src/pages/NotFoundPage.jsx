import { useNavigate } from 'react-router-dom'
import { Button, Card } from '@/shared/ui'
import { Routes } from '@/routes/routes'

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="mx-auto max-w-md text-center p-8 flex flex-col items-center gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">404 Error</p>
        <h1 className="text-2xl font-bold text-slate-800">Page Not Found</h1>
        <p className="text-sm text-slate-600">The page you are looking for does not exist or has been moved.</p>
        <Button onClick={() => navigate(Routes.HOME)} className="w-auto px-6 py-2 mt-2">
          Back To Home
        </Button>
      </Card>
    </div>
  );
}

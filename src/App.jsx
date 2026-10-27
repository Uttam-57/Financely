import '@/index.css'
import AppRouter from '@/routes/Router'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import { store } from '@/shared/utils/store'
import AuthInit from '@/shared/auth/AuthInit'
export default function App() {

    return (
        <Provider store={store}>
            <Toaster position='top-right' closeButton={true} richColors={true} />
            <AuthInit>
                <AppRouter />
            </AuthInit>
        </Provider>
    )
}
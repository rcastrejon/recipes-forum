import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../auth';
import { AuthProvider } from '../auth/providers';
import { PermissionProvider } from '../auth/providers/PermProvider';
import { Login } from '../components/Auth/Login';
import { Register } from '../components/Auth/Register';
import { Dashboard,Navbar } from '../components/index';
import { Favoritos } from '../components/Screens/Favoritos';
import { MisRecetas } from '../components/Screens/MisRecetas';
import { Perfil } from '../components/Screens/Perfil';
import { SingleRecipe } from '../components/Screens/SingleRecipe';

export const AppRouter = () => {
    return (
        <Router>
            <AuthProvider>
                <AuthContext.Consumer>
                    {
                        hasToken =>
                            hasToken ? (
                                <main className="h-screen bg-slate-100">
                                    {(location.pathname != '/login' && location.pathname != '/register') && <Navbar />}
                                    <section className='p-4 bg-slate-100'>
                                        <Routes>
                                            <Route path="/" element={
                                                <Dashboard />
                                            } />
                                            {/*
                                            <Route path="/setup" element={
                                                <PermissionProvider permissions={['admin']}>
                                                    <Setup />
                                                </PermissionProvider>
                                            } /> */}
                                            <Route path='/login' element={<Login />} />
                                            <Route path='/register' element={<Register />} />
                                            <Route path='/dashboard' element={<Dashboard />} />
                                            <Route path='/perfil' element={<Perfil/>}/>
                                            <Route path='/mis-recetas' element={<MisRecetas/>}/>
                                            <Route path='/favoritos' element={<Favoritos/>}/>
                                            <Route path='/recipe/:id' element={<SingleRecipe/>}/>
                                        </Routes>
                                    </section>
                                </main>
                            ) : (
                                <Routes>
                                    <Route path='/login' element={<Login />} />
                                    <Route path='/register' element={<Register />} />
                                </Routes>
                            )
                    }
                </AuthContext.Consumer>
            </AuthProvider>
        </Router>
    );
}
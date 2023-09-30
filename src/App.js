import React, { Suspense, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AuthContext from './store/auth-context';

import ScrollToTop from './ScrollToTop';
import Layout from './component/layout/Layout';
import LoadingSpinner from './component/UI/LoadingSpinner';

const NotFound = React.lazy(() => import('./pages/NotFound'));
const Home = React.lazy(() => import('./pages/Home'));
const RoadBikes = React.lazy(() => import('./pages/RoadBikes'));
const MountainBikes = React.lazy(() => import('./pages/MountainBikes'));
const FoldingBikes = React.lazy(() => import('./pages/FoldingBikes'));
const Cart = React.lazy(() => import('./pages/CartPage'));
const WishList = React.lazy(() => import('./pages/SavedItems'));
const ItemDetail = React.lazy(() => import('./pages/ItemDetail'));
const AuthPage = React.lazy(() => import('./pages/Auth'));
const UserProfile = React.lazy(() => import('./component/profile/Profile'));
const Dashboard = React.lazy(() => import('./component/profile/Dashboard'));
const AccountSettings = React.lazy(() => import('./component/profile/AccountSettings'));

function App() {
    const authCtx = useContext(AuthContext);

    // console.log(authCtx.userStatus);

    return (
        <ScrollToTop>
            <Layout>
                <Suspense
                    fallback={
                        <div className="centered">
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <Routes>
                        <Route path="*" element={<NotFound />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/product/:slug" element={<ItemDetail />} />

                        <Route path="/shop" element={<Navigate to="/road-bikes" replace />} />
                        <Route path="/road-bikes" element={<RoadBikes />} />
                        <Route path="/mountain-bikes" element={<MountainBikes />} />
                        <Route path="/folding-bikes" element={<FoldingBikes />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<WishList />} />

                        {!authCtx.userStatus.userIsLoggedIn && <Route path="/my-account" element={<AuthPage />} />}
                        {authCtx.userStatus.userIsLoggedIn && (
                            <Route path="/my-account" element={<UserProfile />}>
                                <Route index element={<Dashboard />} />
                                <Route path="account-settings" element={<AccountSettings />} />
                            </Route>
                        )}
                        {!authCtx.isLoggedIn && <Route path="/my-account/:link" element={<AuthPage />} />}
                    </Routes>
                </Suspense>
            </Layout>
        </ScrollToTop>
    );
}

export default App;

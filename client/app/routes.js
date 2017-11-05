import Base from './components/Base/Base.jsx';
import HomePage from './containers/HomePage/HomePage.jsx';
import LoginPage from './containers/LoginPage/LoginPage.jsx';
import LogoutPage from './containers/LogoutPage/LogoutPage.jsx';
import Dashboard from './containers/Dashboard/Dashboard.jsx';
import ProfilePage from './containers/ProfilePage/ProfilePage.jsx';

const routes = [
  {
    component: Base,
    routes:[
      {
        path: '/bookclub-app/',
        exact: true,
        component: HomePage
      },
      {
        path: '/bookclub-app/login',
        component: LoginPage
      },
      {
        path: '/bookclub-app/logout',
        component: LogoutPage
      },
      {
        path: '/bookclub-app/dashboard',
        component: Dashboard
      },
      {
        path: '/bookclub-app/profile',
        component: ProfilePage
      },

    ]
  }
]

export default routes;
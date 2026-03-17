export interface IRouterMeta {
    name: string;
    path: string;
    isShow: boolean;
    isAuth?: boolean;
    isCommon?: boolean;
    file?: string;
    requiresLayout?: boolean;
}

export type RouterMetaType = {
    [key: string]: IRouterMeta;
};

const routerMeta: RouterMetaType = {
    HomePage: {
        name: "Home",
        path: "/",
        isShow: true,
        isCommon: true,
        file: 'HomePage',
        requiresLayout: true
    },
    LoginPage: {
        name: "Login",
        path: "/login",
        isShow: true,
        isAuth: false,
        file: 'LoginPage',
        requiresLayout: false,
    },
    RegisterPage: {
        name: "Register",
        path: "/register",
        isShow: true,
        isAuth: false,
        file: 'RegisterPage',
        requiresLayout: false
    },
    ForgotPage: {
        name: "Forgot",
        path: "/forgot-password",
        isShow: true,
        isAuth: false,
        file: 'ForgotPage',
        requiresLayout: false
    },
    UserVerifyPage: {
        name: "UserVerify",
        path: "/verify", // ← Removido el "?"
        isShow: true,
        isAuth: false,
        file: 'UserVerifyPage',
        requiresLayout: false
    },
    ResetPassPage: {
        name: "ResetPass",
        path: "/reset-password", // ← Removido el "?"
        isShow: true,
        isAuth: false,
        file: "ResetPage",
        requiresLayout: false
    },
    ProfilePage: {
        name: "Profile",
        path: "/profile",
        isShow: true,
        isAuth: true,
        file: 'ProfilePage',
        requiresLayout: true
    },
    BlogPage: {
        name: "BlogPage",
        path: "/blog",
        isShow: true,
        isCommon: true,
        file: "BlogPage",
        requiresLayout: true
    },
    UserList: {
        name: "UserListPage",
        path: "/admin/userlist",
        isShow: true,
        isCommon: true,
        file: "UserListPage",
        requiresLayout: true
    },
    DashboardAdminPage: {
        name: "AdminDashboard",
        path: "/admin",
        isShow: true,
        isAuth: true,
        file: "admin/DashboardAdminPage",
        requiresLayout: true
    },
    DashboardUsersPage: {
        name: "UserDashboard",
        path: "/user",
        isShow: true,
        isAuth: true,
        file: "user/DashboardUsersPage",
        requiresLayout: true
    },
    List: {
        name: "ListBlog",
        path: "/blog/listblog",
        isShow: true,
        isAuth: true,
        file: "blog/ListBlog",
        requiresLayout: true
    },
    Comments: {
        name: "Comments",
        path: "/blog/comments",
        isShow: true,
        isAuth: true,
        file: "blog/Comments",
        requiresLayout: true
    },
    AddBlog: {
        name: "AddBlog",
        path: "/blog/addblog",
        isShow: true,
        isAuth: true,
        file: "blog/AddBlog",
        requiresLayout: true
    },
    AddNews: {
        name: "AddNews",
        path: "/news/add",
        isShow: true,
        isAuth: true,
        file: "news/AddNews",
        requiresLayout: true
    },
    ListNews: {
        name: "ListNews",
        path: "/news/list",
        isShow: true,
        isAuth: true,
        file: "ListNewsPage",
        requiresLayout: true
    }
};

export default routerMeta;
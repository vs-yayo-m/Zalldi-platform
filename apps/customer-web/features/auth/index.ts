export { default as LoginView } from "./LoginView";
export { default as RegisterView } from "./RegisterView";
export { default as VerifyEmailView } from "./VerifyEmailView";


// Everything outside this feature imports ONLY from here
// Never import directly from internal files

export { default as LoginView }          from './ui/LoginView'
export { default as ForgotPasswordView } from './ui/ForgotPasswordView'
export { default as ResetPasswordView }  from './ui/ResetPasswordView'
export { default as VerifyEmailView }    from './ui/VerifyEmailView'
export { AuthProvider }                  from './context/AuthContext'
export { useAuth }                       from './hooks/useAuth'
export { useAuthRedirect }               from './hooks/useAuthRedirect'
import LoginForm from "../LoginForm/LoginForm.tsx";
import SignUpForm from "../SignUpForm/SignUpForm.tsx";
import './Login.css';

const Login = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
    return (
        <div className="login-page">
            <div className="login-section">
                <h2 className="section-title">Sign in to your todo-list</h2>
                <LoginForm onLoginSuccess={onLoginSuccess}/>
            </div>

            <div className="signup-section">
                <h2 className="section-title">Create a new account</h2>
                <SignUpForm/>
            </div>
        </div>
    );
};

export default Login;

import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const Login = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
    return (
        <div className="home">
            {/* Login Section */}
            <h2>Sign in to your todo-list</h2>
            <LoginForm onLoginSuccess={onLoginSuccess} />

            {/* Sign-Up Section */}
            <h2>Create a new account</h2>
            <SignUpForm />
        </div>
    );
};

export default Login;

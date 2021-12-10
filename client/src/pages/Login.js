import { useState } from 'react';
import { Notification } from 'react-bulma-components';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/auth';

const Login = () => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch(e) {
            setError(e.response.data.message ? e.response.data.message : "An unknown error occurred");
        }
    }

    return (
        <div className="login hero is-fullheight">
            <div className="hero-body container">
                <div className="columns is-vcentered">
                    <div className="login">
                        <section className="section">
                            {error && <Notification color="danger">{error}</Notification>}
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control has-icons-right">
                                        <input value={email} className="input" type="email" 
                                            onChange={(e) => setEmail(e.target.value)} required/>
                                        <span className="icon is-small is-right">
                                            <i className="fa fa-user"></i>
                                        </span>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control has-icons-right">
                                        <input value={password} className="input" type="password" 
                                            onChange={(e) => setPassword(e.target.value)} required/>
                                        <span className="icon is-small is-right">
                                            <i className="fa fa-key"></i>
                                        </span>
                                    </div>
                                </div>

                                <div className="has-text-centered pt-4 pb-4">
                                    <button className="button is-vcentered is-info is-fullwidth">Login</button>
                                </div>
                            </form>
                            <div className="has-text-centered">
                                <button href="/signup" type="submit" className="button is-ghost">Don't have an account? Sign up now!</button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
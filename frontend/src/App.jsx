import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';

// --- 1. CONTEXT FOR GLOBAL STATE (Auth and User Data) ---
// Using Context to simulate global state management for the user
const AuthContext = createContext();

// Mock User Data and API Simulation
const mockDatabase = {
    // Stores users for validation purposes { username: { fullName, email, password, role } }
    'artisan': { fullName: 'Amara Sinha', email: 'amara.s****@craftique.com', password: 'pass', role: 'Artisan' },
    'buyer': { fullName: 'Hassan Khan', email: 'hassan.k****@craftique.com', password: 'pass', role: 'Buyer' },
};

// Simple utility function to mask email for display purposes
const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    // Masking the first part (username) except for the first two and last two chars
    const maskedName = name.length > 4 
        ? name.substring(0, 2) + '*'.repeat(name.length - 4) + name.substring(name.length - 2)
        : name;
    
    return `${maskedName}@${domain}`;
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (userData) => {
        // In a real app, this would be the payload from the Spring Boot API
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context easily
const useAuth = () => useContext(AuthContext);

// --- 2. SHARED COMPONENTS ---

// Simple state-based navigation hook
const useNav = () => {
    const [page, setPage] = useState('home');
    return (newPage) => setPage(newPage);
};

const Header = ({ navigate }) => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="bg-white shadow-md w-full sticky top-0 z-10">
            <div className="container mx-auto p-4 flex justify-between items-center max-w-7xl">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
                    {/*  */}
                    <span className="text-2xl font-extrabold text-amber-800 tracking-wide">Craftique</span>
                </div>
                
                <nav className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3">
                            {/* Profile Photo Placeholder - Leads to Profile page */}
                            <div 
                                className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer"
                                onClick={() => navigate('profile')}
                            >
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <button 
                                onClick={logout} 
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <button 
                                onClick={() => navigate('login')}
                                className="px-3 py-1 text-sm text-gray-700 hover:text-amber-800 transition duration-150"
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => navigate('register')}
                                className="px-3 py-1 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-150"
                            >
                                Register
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

const Footer = () => (
    <footer className="bg-gray-800 text-white p-6 mt-12">
        <div className="container mx-auto text-center text-sm">
            <p className="mb-2">Craftique by Afrida</p>
            <div className="flex justify-center space-x-4">
                <a href="https://linkedin.com/in/afrida" target="_blank" className="hover:text-amber-400 transition duration-150">LinkedIn</a>
                <a href="https://instagram.com/afrida" target="_blank" className="hover:text-amber-400 transition duration-150">Instagram</a>
                <a href="https://github.com/afridaasad" target="_blank" className="hover:text-amber-400 transition duration-150">GitHub</a>
            </div>
            {/* Chatbot Icon Placeholder (Future feature) */}
            <div className="fixed bottom-4 right-4 bg-green-500 p-3 rounded-full shadow-lg cursor-pointer hover:bg-green-600 transition duration-200 z-50">
                {/*  */}
            </div>
        </div>
    </footer>
);

// Sidebar Skeleton (Used on Dashboard)
const Sidebar = ({ navigate }) => {
    const links = [
        { name: 'Dashboard', page: 'dashboard' },
        { name: 'Products', page: 'products' },
        { name: 'Orders', page: 'orders' },
        { name: 'Wishlist', page: 'wishlist' },
        { name: 'Cart', page: 'cart' },
        { name: 'Profile', page: 'profile' },
    ];
    return (
        <nav className="w-64 space-y-2 p-4 bg-white shadow-xl rounded-xl">
            {links.map(link => (
                <button
                    key={link.page}
                    onClick={() => navigate(link.page)}
                    className="w-full text-left p-3 rounded-lg text-gray-700 hover:bg-amber-100 hover:text-amber-800 transition duration-150 font-medium"
                >
                    {link.name}
                </button>
            ))}
        </nav>
    );
};

// --- 3. PAGE COMPONENTS ---

const HomePage = ({ navigate }) => {
    const { isAuthenticated, user } = useAuth();
    
    const greeting = isAuthenticated 
        ? `Hello, ${user.fullName}` 
        : "Welcome to Craftique, the artisan's marketplace.";

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-amber-800 mb-6">{greeting}</h1>
            
            {/* Quick Stats Placeholder */}
            {isAuthenticated && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-600">
                        <p className="text-sm text-gray-500">Orders Placed</p>
                        <p className="text-3xl font-bold text-gray-800">12</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-600">
                        <p className="text-sm text-gray-500">Wishlist Items</p>
                        <p className="text-3xl font-bold text-gray-800">5</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-600">
                        <p className="text-sm text-gray-500">Recent Cart Value</p>
                        <p className="text-3xl font-bold text-gray-800">$149</p>
                    </div>
                </div>
            )}

            <section className="mt-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Featured Handicrafts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02]">
                            <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                                {/*  */}
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800">Unique Craft #{i + 1}</h3>
                            <p className="text-amber-600 font-bold mt-1">${(30 + i * 5).toFixed(2)}</p>
                            <button onClick={() => navigate('products')} className="mt-3 w-full bg-amber-600 text-white py-2 rounded-lg text-sm hover:bg-amber-700 transition">View Product</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const LoginPage = ({ navigate }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // --- MOCK LOGIN LOGIC (Simulates Spring Boot API call) ---
        const userFound = Object.keys(mockDatabase).find(key => key === username);
        if (userFound && mockDatabase[userFound].password === password) {
            login({ 
                username: userFound, 
                fullName: mockDatabase[userFound].fullName, 
                role: mockDatabase[userFound].role 
            });
            navigate('dashboard');
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-amber-800 mb-6">Login to Craftique</h2>
                {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-sm mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-amber-600 text-white p-3 rounded-lg font-semibold hover:bg-amber-700 transition duration-200 shadow-md"
                    >
                        Log In
                    </button>
                    
                    <div className="text-center pt-2 space-y-2">
                        <button 
                            type="button" 
                            className="text-sm text-amber-600 hover:text-amber-800 transition duration-150"
                            onClick={() => navigate('forgot-password')}
                        >
                            Forgot Password?
                        </button>
                        <p className="text-sm text-gray-600">
                            Don't have an account? <button 
                                type="button" 
                                className="text-amber-600 hover:text-amber-800 font-medium"
                                onClick={() => navigate('register')}
                            >
                                Register
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RegisterPage = ({ navigate }) => {
    const [formData, setFormData] = useState({ 
        username: '', 
        fullName: '', 
        phone: '', 
        email: '', 
        password: '', 
        role: 'Buyer' 
    });
    const [validationStatus, setValidationStatus] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Simulate API calls for real-time validation (will be replaced by Spring Boot endpoints)
    const checkUsernameAvailability = useCallback((username) => {
        if (!username) return;
        // Simulating API latency
        setTimeout(() => {
            const exists = !!mockDatabase[username.toLowerCase()];
            setValidationStatus(prev => ({ ...prev, username: { available: !exists, message: exists ? 'Username already exists' : 'Username available' } }));
        }, 300);
    }, []);

    const checkEmail = useCallback((email) => {
        const isValidFormat = emailRegex.test(email);
        
        if (!isValidFormat) {
            setValidationStatus(prev => ({ 
                ...prev, 
                email: { valid: false, message: 'Enter a valid email' } 
            }));
            return;
        }

        // Simulating API latency and database check
        setTimeout(() => {
            const exists = Object.values(mockDatabase).some(user => user.email.split('@')[0].includes(email.split('@')[0])); // Simple mock check
            setValidationStatus(prev => ({ 
                ...prev, 
                email: { 
                    valid: true, 
                    exists: exists,
                    message: exists ? 'Email already exists' : ''
                } 
            }));
        }, 300);

    }, [emailRegex]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Debounced validation check
        if (name === 'username') checkUsernameAvailability(value);
        if (name === 'email') checkEmail(value);
    };

    const isFormValid = () => {
        // Check for required fields and validation status
        const isEmailValid = validationStatus.email?.valid && !validationStatus.email?.exists;
        const isUsernameAvailable = validationStatus.username?.available;
        
        return formData.username && formData.fullName && formData.email && formData.password && isEmailValid && isUsernameAvailable;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid()) return;
        
        setIsSubmitting(true);
        // MOCK REGISTRATION
        console.log("Registering user:", formData);
        
        // Simulating successful registration and redirect
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Registration Successful! Please log in."); // Using alert only for confirmation here, will use a modal later
            navigate('login');
        }, 1500);
    };


    // Helper component for input validation display
    const ValidationMessage = ({ field, type }) => {
        const status = validationStatus[field];
        
        if (type === 'username') {
            if (!status || !formData[field]) return null;
            return (
                <p className={`text-sm mt-1 font-medium ${status.available ? 'text-green-600' : 'text-red-600'}`}>
                    {status.message}
                </p>
            );
        } else if (type === 'email') {
             if (!formData[field]) return null;

             if (!status) return null; // Wait for check

             if (!status.valid) {
                 return <p className="text-sm mt-1 font-medium text-red-600">{status.message}</p>;
             }
             if (status.exists) {
                 return <p className="text-sm mt-1 font-medium text-red-600">{status.message}</p>;
             }
             // If valid and not exists, the tick inside the box handles success.
             return null;
        }
        return null;
    };


    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-amber-800 mb-6">Create Your Account</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username Field with Real-Time Validation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150 ${validationStatus.username?.available === false ? 'border-red-500' : validationStatus.username?.available === true ? 'border-green-500' : 'border-gray-300'}`}
                            required
                        />
                        <ValidationMessage field="username" type="username" />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                        />
                    </div>

                    {/* Email Field with Real-Time Validation and Tick */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150 pr-10 ${validationStatus.email?.valid === false || validationStatus.email?.exists === true ? 'border-red-500' : validationStatus.email?.valid === true && validationStatus.email?.exists === false ? 'border-green-500' : 'border-gray-300'}`}
                                required
                            />
                            {validationStatus.email?.valid && !validationStatus.email?.exists && (
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-600">
                                    {/* Tick Icon */}
                                    &#10003; 
                                </span>
                            )}
                        </div>
                        <ValidationMessage field="email" type="email" />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                        />
                    </div>
                    
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">Role</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150 bg-white"
                        >
                            <option value="Buyer">Buyer</option>
                            <option value="Artisan">Artisan</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || !isFormValid()}
                        className={`w-full p-3 rounded-lg font-semibold transition duration-200 shadow-md ${isFormValid() ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                    
                    <div className="text-center pt-2">
                        <button 
                            type="button" 
                            className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                            onClick={() => navigate('login')}
                        >
                            Already have an account? Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ForgotPasswordPage = ({ navigate }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('input'); // 'input', 'success', 'error'
    const [maskedEmail, setMaskedEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        // --- MOCK API CALL TO SPRING BOOT /api/auth/forgot-password ---
        const userExists = Object.values(mockDatabase).some(user => user.email.split('@')[0].includes(email.split('@')[0]));

        if (userExists) {
            // Success logic: Backend sends token and returns masked email
            const mockMaskedEmail = maskEmail(email);
            setMaskedEmail(mockMaskedEmail);
            setStatus('success');
        } else {
            // Error logic: Email not found
            setErrorMessage('Email not found. Please check the address and try again.');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return <PasswordResetSuccess navigate={navigate} maskedEmail={maskedEmail} />;
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-amber-800 mb-6">Reset Your Password</h2>
                <p className="text-gray-600 mb-4 text-center text-sm">
                    Enter your email address below and we will send you a secure link to reset your password.
                </p>

                {errorMessage && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-sm mb-4">{errorMessage}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-amber-600 text-white p-3 rounded-lg font-semibold hover:bg-amber-700 transition duration-200 shadow-md"
                    >
                        Send Reset Link
                    </button>
                    
                    <div className="text-center pt-2">
                        <button 
                            type="button" 
                            className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                            onClick={() => navigate('login')}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PasswordResetSuccess = ({ navigate, maskedEmail }) => {
    const [countdown, setCountdown] = useState(10); // 10-second timer

    useEffect(() => {
        if (countdown === 0) {
            navigate('login');
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-2xl border border-green-200 text-center">
                {/*  */}
                <div className="text-green-600 text-5xl mb-4">&#10003;</div>
                <h2 className="text-3xl font-bold text-green-700 mb-4">Link Sent Successfully!</h2>
                
                {/* Required Masked Email Display */}
                <p className="text-gray-700 text-lg mb-6">
                    A password reset link has been sent to your email: <br/>
                    <strong className="text-amber-800 tracking-wider">{maskedEmail}</strong>
                </p>

                {/* Required Auto-Refresh Logic */}
                <p className="text-sm text-gray-500 mt-6">
                    This page will automatically redirect to the login screen in **{countdown}** seconds.
                </p>
                
                <button 
                    onClick={() => navigate('login')} 
                    className="mt-6 text-sm bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                >
                    Go to Login Now
                </button>
            </div>
        </div>
    );
};


const Dashboard = ({ navigate }) => {
    const { user } = useAuth();
    const greetingName = user?.fullName || user?.username || 'User';

    return (
        <div className="max-w-7xl mx-auto flex">
            {/* Sidebar */}
            <div className="p-4">
                <Sidebar navigate={navigate} />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <h1 className="text-4xl font-extrabold text-amber-800 mb-6">
                    Hello, {greetingName}! 
                </h1>
                
                <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-xl shadow-md mb-8">
                    <p className="text-gray-700 font-semibold text-lg">
                        Welcome to your **{user?.role}** Dashboard.
                    </p>
                    <p className="text-gray-500 mt-2 text-sm">
                        This is where your personalized analytics, order tracking, and quick management links will appear.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-700 mb-4">Quick Stats (Placeholder)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard title="Total Products" value="45" icon="📦" />
                    <StatCard title="Orders Received" value="12" icon="🛒" />
                    <StatCard title="Pending Approvals" value="3" icon="⏳" />
                    <StatCard title="Total Earnings" value="$5,120" icon="💰" />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
    </div>
);

// Placeholder Pages (To be developed in future steps)
const PlaceholderPage = ({ title }) => (
    <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-amber-800 mb-6">{title}</h1>
        <div className="bg-gray-100 p-8 rounded-xl shadow-md">
            <p className="text-gray-600">
                This page is currently under development. It will be the central hub for managing your {title.toLowerCase()} in Craftique.
            </p>
            <p className="text-sm text-gray-400 mt-4">
                *(We will integrate the data from the Spring Boot backend here in the next major development phase.)*
            </p>
        </div>
    </div>
);


// --- 4. MAIN APP COMPONENT (Routing Logic) ---

const AppContent = ({ navigate, page }) => {
    const { isAuthenticated } = useAuth();
    
    // Custom router logic using switch/case
    const renderPage = () => {
        switch (page) {
            case 'login': return <LoginPage navigate={navigate} />;
            case 'register': return <RegisterPage navigate={navigate} />;
            case 'forgot-password': return <ForgotPasswordPage navigate={navigate} />;
            
            // Authenticated Routes
            case 'dashboard':
            case 'home': // Landing page after login
                return isAuthenticated ? <Dashboard navigate={navigate} /> : <HomePage navigate={navigate} />;

            case 'products':
            case 'orders':
            case 'wishlist':
            case 'cart':
            case 'profile':
                return isAuthenticated ? <PlaceholderPage title={page.charAt(0).toUpperCase() + page.slice(1)} /> : <LoginPage navigate={navigate} />;

            default:
                return <HomePage navigate={navigate} />;
        }
    };

    return (
        <>
            <Header navigate={navigate} />
            <main className="min-h-screen">
                {renderPage()}
            </main>
            <Footer />
        </>
    );
};

// Main Exported Component
const App = () => {
    const [page, setPage] = useState('home');
    
    // Simple global navigation function
    const navigate = (newPage) => {
        setPage(newPage);
        // Reset scroll to top on navigation for better UX
        window.scrollTo(0, 0); 
    };

    return (
        <div className="bg-gray-50 font-sans min-h-screen">
            <script src="https://cdn.tailwindcss.com"></script>
            <style dangerouslySetInnerHTML={{__html: `
                /* Custom Scrollbar for Woodcraft Theme */
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #f5f5f5; }
                ::-webkit-scrollbar-thumb { background: #b45309; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #78350f; }
                /* Inter font */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                body { font-family: 'Inter', sans-serif; }
            `}} />
            <AuthProvider>
                <AppContent navigate={navigate} page={page} />
            </AuthProvider>
        </div>
    );
};

export default App;

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveTokens } from "../../utils/auth";
import logo from '../../assets/images/logo.png'
import { FaEye, FaEyeSlash } from "react-icons/fa";




function Login() {
    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loginMode, setLoginMode] = useState(null);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef(null);


    // ---------------------------------------------
    // Handle input changes
    // ---------------------------------------------

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    // ---------------------------------------------
    // Select User Login
    // ---------------------------------------------

    const handleUserLogin = (username) => {

        setLoginMode(username);

        setForm({
            username: username,
            password: "",
        });

        setMsg("");

        // Focus password input automatically
        setTimeout(() => {
            passwordRef.current?.focus();
        }, 0);
    };


    // ---------------------------------------------
    // Return to normal login
    // ---------------------------------------------

    const handleNormalLogin = () => {

        setLoginMode(null);

        setForm({
            username: "",
            password: "",
        });

        setMsg("");
    };


    // ---------------------------------------------
    // Login
    // ---------------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMsg("");

        try {

            const response = await fetch(
                `${BASE}/api/token/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(form),
                }
            );


            console.log(response.status);


            const data = await response.json();


            if (response.ok) {

                saveTokens(data);

                setMsg(
                    "تم تسجيل الدخول بنجاح! جاري التحويل..."
                );


                setTimeout(() => {

                    navigate("/ar-dashboard");

                }, 800);


            } else {

                setMsg(
                    data.detail ||
                    "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى."
                );

            }


        } catch (error) {

            console.error(error);

            setMsg(
                "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى."
            );

        }
    };


    return (

        <div
            dir="rtl"
            className="
                min-h-screen
                bg-blue-50
                flex
                items-center
                justify-center
                px-6
                py-10
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-2xl
                    shadow-xl
                    border
                    border-stone-200
                    p-4
                "
            >

                {/* -------------------------------- */}
                {/* Header */}
                {/* -------------------------------- */}

                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="Logo"
                        className="
                        mx-auto
                        w-15
                        h-15
                        object-contain
                        shadow-[0_0_7px_rgba(0,0,0,0.4)]
                        rounded-lg
                        mb-4
                    "
                    />
                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-blue-600
                            font-extrabold
                        "
                    >
                        قمة الرواسي المحاسبي
                    </h1>

                    <p className="text-gray-600 mt-2">
                        مرحبا بك .. رجاء قم بتسجيل الدخول الى حسابك
                    </p>

                </div>


                {/* -------------------------------- */}
                {/* Quick Login Buttons */}
                {/* -------------------------------- */}

                {!loginMode && (

                    <div className="space-y-3 mb-5">

                        {/* Owner */}

                        <button
                            type="button"
                            onClick={() =>
                                handleUserLogin("owner")
                            }
                            className="
                                w-full
                                bg-blue-100
                                hover:bg-blue-200
                                text-blue-700
                                py-3
                                rounded-sm
                                transition
                                duration-200
                                cursor-pointer
                                shadow-xl
                            "
                        >
                            <span className ='font-extrabold text-sm text-gray-600'>السيد</span>
                            <span className = 'text-xs text-gray-600'>/ </span><span></span><span></span>
                            <span className ='font-extrabold text-lg'>المالك</span>
                        </button>


                        {/* Yahia */}

                        <button
                            type="button"
                            onClick={() =>
                                handleUserLogin("yahia")
                            }
                            className="
                                w-full
                                bg-blue-100
                                hover:bg-blue-200
                                text-blue-700
                                py-3
                                rounded-sm
                                transition
                                duration-200
                                cursor-pointer
                                shadow-xl
                            "
                        >
                            <span className ='font-extrabold text-sm text-gray-600'>السيد</span>
                            <span className = 'text-xs text-gray-600'>/ </span><span></span><span></span>
                            <span className ='font-extrabold text-lg'>يحيى</span>
                        </button>


                        {/* Nader */}

                        <button
                            type="button"
                            onClick={() =>
                                handleUserLogin("nader")
                            }
                            className="
                                w-full
                                bg-blue-100
                                hover:bg-blue-200
                                text-blue-700
                                
                                py-3
                                rounded-sm
                                transition
                                duration-200
                                cursor-pointer
                                shadow-xl
                                
                            "
                        >
                            <span className ='font-extrabold text-sm text-gray-600'>السيد</span>
                            <span className = 'text-xs text-gray-600'>/ </span><span></span><span></span>
                            <span className ='font-extrabold text-lg'>نادر</span>
                        </button>

                    </div>

                )}


                {/* -------------------------------- */}
                {/* Selected User Header */}
                {/* -------------------------------- */}

                {loginMode && (

                    <div
                        className="
                            mb-5
                            rounded-lg
                            bg-blue-50
                            border
                            border-blue-100
                            px-4
                            py-3
                            text-center
                        "
                    >

                        <p className="text-sm text-blue-700">

                            {loginMode === "owner"
                                ? "تسجيل دخول المالك"
                                : loginMode === "yahia"
                                ? "تسجيل دخول يحيى"
                                : "تسجيل دخول نادر"}

                        </p>


                        <p className="text-xs text-gray-500 mt-1">

                            المستخدم: {loginMode}

                        </p>

                    </div>

                )}


                {/* -------------------------------- */}
                {/* Login Form */}
                {/* -------------------------------- */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Username */}

                    {!loginMode && (

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-600
                                    mb-2
                                "
                            >
                                اسم المستخدم
                            </label>


                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="أدخل اسم المستخدم"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    bg-blue-50
                                    border-blue-50
                                    px-4
                                    py-3
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                "
                            />

                        </div>

                    )}


                    {/* Password */}

                    <div>

    <label
        className="
            block
            text-sm
            font-medium
            text-gray-600
            mb-2
        "
    >
        كلمة المرور
    </label>


    <div className="relative">

        <input
            ref={passwordRef}
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="أدخل كلمة المرور"
            required
            className="
                w-full
                rounded-lg
                bg-blue-50
                border
                border-blue-50
                px-4
                py-3
                pl-12
                outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
                transition
            "
        />


        <button
            type="button"
            onClick={() =>
                setShowPassword((prev) => !prev)
            }
            className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-500
                hover:text-blue-600
                cursor-pointer
                transition
            "
            aria-label={
                showPassword
                    ? "إخفاء كلمة المرور"
                    : "إظهار كلمة المرور"
            }
        >

            {showPassword ? (
                <FaEyeSlash size={18} />
            ) : (
                <FaEye size={18} />
            )}

        </button>

    </div>

</div>


                    {/* Login Button */}

                    <button
                        type="submit"
                        className="
                            w-full
                            bg-blue-500
                            hover:bg-blue-600
                            text-white
                            font-extrabold
                            py-3
                            rounded-lg
                            transition
                            duration-200
                            cursor-pointer
                        "
                    >
                        تسجيل الدخول
                    </button>

                </form>


                {/* -------------------------------- */}
                {/* Back to Normal Login */}
                {/* -------------------------------- */}

                {loginMode && (

                    <button
                        type="button"
                        onClick={handleNormalLogin}
                        className="
                            w-full
                            mt-4
                            text-sm
                            text-gray-500
                            hover:text-blue-600
                            transition
                            cursor-pointer
                        "
                    >
                        العودة إلى تسجيل الدخول العادي
                    </button>

                )}


                {/* -------------------------------- */}
                {/* Message */}
                {/* -------------------------------- */}

                {msg && (

                    <div
                        className="
                            mt-6
                            rounded-lg
                            bg-green-100
                            border
                            border-green-200
                            px-4
                            py-3
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-green-700
                                text-center
                            "
                        >
                            {msg}
                        </p>

                    </div>

                )}


                {/* -------------------------------- */}
                {/* Signup */}
                {/* -------------------------------- */}

                {!loginMode && (

                    <div
                        className="
                            mt-8
                            text-center
                            text-sm
                            text-stone-600
                        "
                    >

                        ليس لديك حساب؟

                        <a
                            href="/signup"
                            className="
                                mr-2
                                font-semibold
                                text-blue-600
                                underline
                            "
                        >
                            إنشاء حساب
                        </a>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Login;



// import { useState } from 'react' ;
// import { useNavigate } from 'react-router-dom' ;
// import { saveTokens } from '../../utils/auth';

// function Login() {
//     const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
//     const [form, setForm] = useState({ username: "", password: "" });
//     const [msg, setMsg] = useState("");
//     const navigate = useNavigate();
    
//     const handleChange = (e) => {
//         setForm({ ...form , [e.target.name]: e.target.value });
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault() ;
//         setMsg("");
        
//         try {
//             const response = await fetch(`${BASE}/api/token/`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type":"application/json",
//                 },

//                 body: JSON.stringify(form),
//             });

//             console.log(response.status);
            
//             const data = await response.json();
//             if (response.ok) {
//                 saveTokens(data);
//                 setMsg("Login successfully! Redirectring...")
                
//                 setTimeout(() => {
//                     navigate('/');
//                     navigate('/ar-home');
//                 }, 800);
//             } else{
//                 setMsg(data.detail || "Login failed. Please try again.")
//             }

//         } catch (error) {
//             // setMsg("An error occurred. Please try agian.")
//             console.error(error);
//             setMsg(error.message);
//         }
//     };

//     return ( //bg-taupe-100
//         <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6 py-10">
    
//             <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-8">
    
//                 <div className="text-center mb-8">
    
//                     <h1 className="text-3xl font-bold text-blue-600">
//                         Welcome Back
//                     </h1>
    
//                     <p className="text-gray-600 mt-2">
//                         Sign in to your account
//                     </p>
    
//                 </div>
    
//                 <form onSubmit={handleSubmit} className="space-y-5">
    
//                     <div>
    
//                         <label className="block text-sm font-medium text-gray-600 mb-2">
//                             Username
//                         </label>
    
//                         <input
//                             name="username"
//                             value={form.username}
//                             onChange={handleChange}
//                             placeholder="Enter your username"
//                             required
//                             className="w-full rounded-lg border bg-blue-50 border-blue-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
//                         />
    
//                     </div>
    
//                     <div>
    
//                         <label className="block text-sm font-medium text-gray-600 mb-2">
//                             Password
//                         </label>
    
//                         <input
//                             name="password"
//                             type="password"
//                             value={form.password}
//                             onChange={handleChange}
//                             placeholder="Enter your password"
//                             required
//                             className="w-full rounded-lg bg-blue-50 border border-blue-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                         />
    
//                     </div>
    
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-500  text-white font-semibold py-3 rounded-lg transition duration-200 cursor-pointer"
//                     >
//                         Login
//                     </button>
    
//                 </form>
    
//                 {msg && (
    
//                     <div className="mt-6 rounded-lg bg-green-100 border border-stone-200 px-4 py-3">
    
//                         <p className="text-sm text-green-700 text-center">
//                             {msg}
//                         </p>
    
//                     </div>
    
//                 )}
    
//                 <div className="mt-8 text-center text-sm text-stone-600">
    
//                     Don't have an account?
    
//                     <a
//                         href="/signup"
//                         className="ml-2 font-semibold text-blue-600 underline"
//                     >
//                         Create Account
//                     </a>
    
//                 </div>
    
//             </div>
    
//         </div>
//     );
// }



// export default Login ;
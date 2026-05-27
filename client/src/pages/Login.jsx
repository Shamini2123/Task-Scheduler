import {
  useState
} from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../services/api";

import {
  useAuth
} from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      login(res.data);

      toast.success("Login Successful");

      navigate("/");

    } catch (err) {

      toast.error("Invalid credentials");
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-black text-white">

      <form
        onSubmit={submitHandler}
        className="bg-slate-900 p-10 rounded-2xl w-[90%] max-w-md border border-slate-800"
      >

        <h1 className="text-4xl font-bold mb-8">
          Login
        </h1>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value
              })
            }
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value
              })
            }
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold"
          >
            Login
          </button>

          <p className="text-slate-400 text-center">

            No account?

            <Link
              to="/register"
              className="text-blue-400 ml-2"
            >
              Register
            </Link>

          </p>

        </div>

      </form>

    </div>
  );
}

export default Login;
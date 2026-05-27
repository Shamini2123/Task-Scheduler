import {
  useState
} from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/auth/register",
        formData
      );

      toast.success("Registration Successful");

      navigate("/login");

    } catch (err) {

      toast.error("Registration failed");
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-black text-white">

      <form
        onSubmit={submitHandler}
        className="bg-slate-900 p-10 rounded-2xl w-[90%] max-w-md border border-slate-800"
      >

        <h1 className="text-4xl font-bold mb-8">
          Register
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
              })
            }
            className="w-full bg-slate-800 p-4 rounded-xl"
          />

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
            className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-semibold"
          >
            Register
          </button>

          <p className="text-slate-400 text-center">

            Already have account?

            <Link
              to="/login"
              className="text-blue-400 ml-2"
            >
              Login
            </Link>

          </p>

        </div>

      </form>

    </div>
  );
}

export default Register;
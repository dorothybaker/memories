import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../utils/makeRequest";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const { mutate: signup, isPending } = useMutation({
    mutationFn: async ({ fullName, email, username, password }) => {
      try {
        const res = await API.post("/auth/signup", {
          fullName,
          email,
          password,
          username,
        });

        if (res.status === 201) {
          const data = res.data;

          setError("");
          setFormData({
            fullName: "",
            username: "",
            email: "",
            password: "",
          });

          return data;
        }
      } catch (error) {
        setError(error.response.data);
        console.log(error);
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }
    },
  });

  const handleSignup = () => {
    if (formData.password.length < 7) {
      setError("Password must be atleast 7 characters long!");
      return;
    }

    setError("");
    signup(formData);
  };

  return (
    <section className="py-5 max-w-xl mx-auto">
      <div className="bg-white w-full px-4 py-5 flex flex-col gap-3">
        <div className="flex flex-col">
          <h1 className="text-primary text-2xl">Sign up</h1>
          <span>to continue to Memories</span>
        </div>
        {error && <span className="text-[15px] text-red-500">{error}</span>}
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <input
            type="text"
            placeholder="Full Name"
            className="h-12 w-full outline-none bg-gray-300 px-3 rounded-md"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Username"
            className="h-12 w-full outline-none bg-gray-300 px-3 rounded-md"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email address"
            className="h-12 w-full outline-none bg-gray-300 px-3 rounded-md"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="h-12 w-full outline-none bg-gray-300 px-3 rounded-md"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button
            className="bg-primary text-white uppercase h-12 rounded-md mt-2"
            disabled={isPending}
          >
            {isPending ? "Signing up" : "Sign up"}
          </button>
        </form>
        <span>
          Already have an account?{" "}
          <Link to="/signin" className="text-primary">
            Sign in!
          </Link>
        </span>
      </div>
    </section>
  );
}

export default Signup;

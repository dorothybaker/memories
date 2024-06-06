import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../utils/makeRequest";

function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const { mutate: signin, isPending } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await API.post("/auth/signin", {
          email,
          password,
        });

        if (res.status === 200) {
          const data = res.data;

          setError("");
          setFormData({
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

  return (
    <section className="py-5 max-w-xl mx-auto">
      <div className="bg-white w-full px-4 py-5 flex flex-col gap-3">
        <div className="flex flex-col">
          <h1 className="text-primary text-2xl">Sign in</h1>
          <span>to continue to Memories</span>
        </div>
        {error && <span className="text-[15px] text-red-500">{error}</span>}
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            signin(formData);
          }}
        >
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
            {isPending ? "Signing in" : "Sign in"}
          </button>
        </form>
        <span>
          First time using Memories?{" "}
          <Link to="/signup" className="text-primary">
            Sign up!
          </Link>
        </span>
      </div>
    </section>
  );
}

export default Signin;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API } from "../utils/makeRequest";
import { Menu } from "@mantine/core";

import { TfiMenuAlt } from "react-icons/tfi";

function Topbar() {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const isAuth = pathname === "/signin" || pathname === "/signup";

  const { data: user } = useQuery({ queryKey: ["authUser"] });

  const queryClient = useQueryClient();
  const { mutate: signout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await API.post("/auth/signout", {});

        if (res.status === 200) {
          const data = res.data;

          return data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        navigate("/");
        window.location.reload();
      }
    },
  });

  return (
    <header className="max-w-7xl mx-auto bg-white my-3 p-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-primary text-3xl">
          <Link to="/">Memories</Link>
        </h1>
        {!isAuth && !user && (
          <button
            className="text-primary uppercase"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </button>
        )}
        {!isAuth && user && (
          <>
            <ul className="sm:flex hidden items-center gap-4 uppercase">
              <li
                onClick={() => navigate("/create")}
                className="cursor-pointer"
              >
                Create Memory
              </li>
              <li className="text-primary cursor-pointer" onClick={signout}>
                sign out
              </li>
            </ul>

            <div className="sm:hidden block">
              <Menu width={280}>
                <Menu.Target>
                  <button>
                    <TfiMenuAlt size={27} className="text-primary" />
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>
                    <span
                      className="text-[16.5px] uppercase w-full"
                      onClick={() => navigate("/create")}
                    >
                      Create Memory
                    </span>
                  </Menu.Item>
                  <Menu.Item>
                    <span
                      className="text-primary text-[16.5px] uppercase w-full"
                      onClick={signout}
                    >
                      Sign out
                    </span>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;

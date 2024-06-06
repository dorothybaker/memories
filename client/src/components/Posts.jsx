import { useQuery } from "@tanstack/react-query";
import { API } from "../utils/makeRequest";
import Post from "./Post";

function Posts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      try {
        const res = await API.get("/posts/");

        if (res.status === 200) {
          const data = res.data;

          return data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-7 grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 md:gap-10 gap-4">
      {isLoading
        ? [1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="h-[200px] bg-gray-100/40 w-full rounded-3xl" />
              <div className="h-12 bg-gray-100/40 w-full rounded-3xl" />
              <div className="h-12 bg-gray-100/40 w-full rounded-3xl" />
              <div className="h-16 bg-gray-100/40 w-full rounded-3xl" />
            </div>
          ))
        : posts?.map((post) => <Post key={post._id} post={post} />)}
    </section>
  );
}

export default Posts;

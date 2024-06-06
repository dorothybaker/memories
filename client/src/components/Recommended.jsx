import { useQuery } from "@tanstack/react-query";
import { API } from "../utils/makeRequest";
import Card from "./Card";

function Recommended({ tags }) {
  const { data: recommended, isLoading: isFetching } = useQuery({
    queryKey: ["recommended"],
    queryFn: async () => {
      try {
        const res = await API.get(`/posts/recommended?query=${tags.join(",")}`);

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
    <section className="max-w-7xl mx-auto px-4 py-7 grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 md:gap-10 gap-4 my-3">
      {isFetching
        ? [1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="h-[200px] bg-gray-100/40 w-full rounded-3xl" />
              <div className="h-12 bg-gray-100/40 w-full rounded-3xl" />
              <div className="h-12 bg-gray-100/40 w-full rounded-3xl" />
              <div className="h-16 bg-gray-100/40 w-full rounded-3xl" />
            </div>
          ))
        : recommended?.map((post) => <Card key={post._id} post={post} />)}
    </section>
  );
}

export default Recommended;

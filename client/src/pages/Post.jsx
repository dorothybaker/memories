import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { API } from "../utils/makeRequest";
import moment from "moment";
import { Box, LoadingOverlay } from "@mantine/core";
import Recommended from "../components/Recommended";

function Post() {
  const { id } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["memory", id],
    queryFn: async () => {
      try {
        const res = await API.get(`/posts/${id}`);

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
    <>
      {isLoading ? (
        <Box pos={"relative"}>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ blur: 2 }}
            bg={""}
          />
        </Box>
      ) : (
        <>
          <section className="max-w-7xl mx-auto w-full px-4 py-7 flex gap-5 bg-white my-5 lg:flex-row flex-col-reverse">
            <div className="flex-2 flex flex-col gap-1">
              <h2 className="text-2xl">{post?.title}</h2>
              <div className="flex items-center gap-1 text-gray-500">
                {post?.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <span className="text-slate-700">
                {moment(post?.createdAt).fromNow()}
              </span>

              <p>{post?.message}</p>
              <div className="flex flex-col">
                <span className="text-lg">
                  Created by{" "}
                  <span className="text-primary">{post?.creator.fullName}</span>
                </span>
                <span className="text-gray-500">@{post?.creator.username}</span>{" "}
              </div>
            </div>
            <div className="flex-1">
              <img src={post?.image} alt="" className="max-h-[350px]" />
            </div>
          </section>

          <Recommended tags={post?.tags} />
        </>
      )}
    </>
  );
}

export default Post;

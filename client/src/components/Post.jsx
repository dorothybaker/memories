import moment from "moment";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { GoThumbsup, GoTrash } from "react-icons/go";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../utils/makeRequest";
import { useNavigate } from "react-router-dom";

function Post({ post }) {
  const { data: user } = useQuery({ queryKey: ["authUser"] });

  let mine;
  if (user) {
    mine = post?.creator._id === user._id;
  }

  const queryClient = useQueryClient();
  const { mutate: deleteMemory, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await API.delete(`/posts/${post?._id}`);

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
        queryClient.invalidateQueries({ queryKey: ["memories"] });
      }
    },
  });

  const { mutate: likeMemory, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await API.post(`/posts/like/${post?._id}`, {});

        if (res.status === 200) {
          const data = res.data;

          return data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });

  const navigate = useNavigate();

  return (
    <section className="rounded-3xl">
      <div
        className="relative rounded-t-3xl overflow-hidden cursor-pointer"
        onClick={() => navigate(`/memory/${post._id}`)}
      >
        <img
          src={post?.image}
          alt=""
          className="lg:h-[200px] md:h-[250px] sm:h-[220px] h-[200px] w-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30">
          <div className="flex flex-col gap-1 text-slate-200 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xl">@{post?.creator?.username}</span>
              <IoEllipsisHorizontal size={22} />
            </div>
            <span className="text-lg text-slate-300">
              {moment(post?.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white px-3 py-2 rounded-b-3xl flex flex-col gap-2">
        <div className="text-gray-600">Tags: {post?.tags.join(",")}</div>
        <h3 className="text-lg text-primary line-clamp-1">{post?.title}</h3>
        <p className="line-clamp-3">{post?.message}</p>
        <div className="flex items-center justify-between">
          {user && (
            <div className="flex items-center gap-1 text-blue-500">
              <span className="text-lg mt-0.5">{post?.likes.length}</span>
              <GoThumbsup
                size={18}
                className="cursor-pointer"
                onClick={likeMemory}
                aria-disabled={isLiking}
              />
              <span className="text-sm uppercase mt-0.5">
                {isLiking ? "Liking" : "like"}
              </span>
            </div>
          )}
          {mine && (
            <div className="flex items-center gap-1 text-red-500">
              <GoTrash
                size={17}
                onClick={deleteMemory}
                aria-disabled={isPending}
                className="cursor-pointer"
              />
              <span className="text-sm uppercase mt-0.5">
                {isPending ? "deleting" : "delete"}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Post;

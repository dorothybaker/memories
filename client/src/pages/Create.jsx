import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { API } from "../utils/makeRequest";
import { useNavigate } from "react-router-dom";

function Create() {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    image: "",
    tags: [],
  });

  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "duihsu76h",
        uploadPreset: "olcoi33y",
        maxFiles: 1,
      },
      (err, result) => {
        if (result.event === "success") {
          setPostData({ ...postData, image: result.info.secure_url });
        }
      }
    );
  }, []);

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate: createMemory, isPending } = useMutation({
    mutationFn: async ({ title, message, image, tags }) => {
      try {
        const res = await API.post("/posts/create", {
          title,
          message,
          image,
          tags,
        });

        if (res.status === 201) {
          const data = res.data;

          setPostData({ title: "", message: "", image: "", tags: [] });

          return data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["memories"] });
        navigate("/");
      }
    },
  });

  return (
    <section className="my-5 max-w-xl mx-auto w-full">
      <div className="bg-white px-4 py-6 w-full flex flex-col gap-3">
        <h2 className="text-2xl">Create your memory</h2>
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            createMemory(postData);
          }}
        >
          <button
            type="button"
            className={`w-max mx-auto uppercase ${
              postData.image !== "" ? "text-green-700" : "text-primary"
            } h-11`}
            onClick={() => widgetRef.current?.open()}
          >
            {postData.image !== ""
              ? "Memory image successfully uploaded"
              : "Click to upload memory image"}
          </button>
          <input
            type="text"
            placeholder="Title of memory"
            className="h-12 px-3 w-full bg-gray-300 rounded-md outline-none"
            value={postData.title}
            onChange={(e) =>
              setPostData({ ...postData, title: e.target.value })
            }
          />
          <textarea
            className="h-[150px] w-full resize-none bg-gray-300 p-3 outline-none rounded-md"
            placeholder="Description of your memory"
            value={postData.message}
            onChange={(e) =>
              setPostData({ ...postData, message: e.target.value })
            }
          ></textarea>
          <input
            type="text"
            placeholder="Tags (seperate by comma)"
            className="h-12 px-3 w-full bg-gray-300 rounded-md outline-none"
            value={postData.tags}
            onChange={(e) =>
              setPostData({
                ...postData,
                tags: e.target.value.split(","),
              })
            }
          />

          <button
            type="submit"
            className="uppercase text-white bg-primary h-11 flex items-center justify-center rounded-md mt-2"
            disabled={isPending}
          >
            {isPending ? "Creating memory" : "Create memory"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Create;

import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [String],
    image: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        message: String,
        createdAt: { type: Date, default: new Date() },
      },
    ],
  },
  { timestamps: true }
);

const Post = model("Post", PostSchema);

export default Post;

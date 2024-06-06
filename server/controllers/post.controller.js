import Post from "../models/post.model.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "creator", select: "-password" });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error.message || "Internal Server Error!");
  }
};

export const createPost = async (req, res) => {
  const userId = req.user._id;
  const { title, message, tags, image } = req.body;

  try {
    const newPost = new Post({ title, message, tags, image, creator: userId });

    if (newPost) {
      await newPost.save();

      res.status(201).json("Post created successfully!");
    } else {
      res.status(403).json("Invalid post data provided!");
    }
  } catch (error) {
    res.status(500).json(error.message || "Internal Server Error!");
  }
};

export const deleteMemory = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate({
      path: "creator",
      select: "-password",
    });
    if (!post) return res.status(404).json("Post not found!");

    const isMyPost = userId.toString() === post.creator._id.toString();

    if (isMyPost) {
      await Post.findByIdAndDelete(post._id);

      res.status(200).json("Post deleted successfully");
    } else {
      res.status(403).json("You can only delete your post!");
    }
  } catch (error) {
    res.status(500).json(error.message || "Internal Server Error!");
  }
};

export const likeAndDislike = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate({
      path: "creator",
      select: "-password",
    });
    if (!post) return res.status(404).json("Post not found!");

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.findByIdAndUpdate(post._id, { $pull: { likes: userId } });
      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      await Post.findByIdAndUpdate(post._id, { $push: { likes: userId } });
      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    res.status(500).json(error.message || "Internal Server Error!");
  }
};

export const getMemory = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate({
      path: "creator",
      select: "-password",
    });
    if (!post) return res.status(404).json("Post not found!");

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error.message || "Internal Server Error!");
  }
};

export const getRecommendedPosts = async (req, res) => {
  const { query: tags } = req.query;

  try {
    const posts = await Post.find({ tags: { $in: tags.split(",") } })
      .limit(4)
      .populate({
        path: "creator",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error.message || "Internal Server Error!");
  }
};

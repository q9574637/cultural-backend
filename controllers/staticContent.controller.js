import StaticContent from "../models/staticContent.model.js";

// Get static content
export const getStaticContent = async (req, res) => {
  try {
    const content = await StaticContent.findOne();
    if (!content) {
      return res.status(404).json({ message: "Static content not found" });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create default static content
export const createStaticContent = async (req, res) => {
  try {
    const contentExists = await StaticContent.findOne();
    if (contentExists) {
      return res.status(400).json({ message: "Static content already exists" });
    }
    const newContent = await StaticContent.create(req.body);
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update static content
export const updateStaticContent = async (req, res) => {
  try {
    const updatedContent = await StaticContent.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedContent) {
      return res.status(404).json({ message: "Static content not found" });
    }
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

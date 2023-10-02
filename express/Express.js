const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/Blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Blog = mongoose.model('Blogpost', blogSchema); // Change the model name to match your collection name

app.use(cors());
app.use(bodyParser.json());

// Define routes for CRUD operations
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

app.post('/api/blogs', async (req, res) => {
  const { title, description } = req.body;
  try {
    const blog = new Blog({ title, description });
    await blog.save();
    res.json({ message: 'Blog added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding blog' });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  const { title, description } = req.body;
  const blogId = req.params.id;

  try {
    const blog = await Blog.findByIdAndUpdate(blogId, { title, description });
    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating blog' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const blogId = req.params.id;

  try {
    await Blog.findByIdAndRemove(blogId);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting blog' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

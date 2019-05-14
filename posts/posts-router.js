const express = require('express');

const Posts = require('./db.js');

const router = express.Router();

// /api/posts
router.post('/', async (req, res) => {
    const newPost = req.body;

    if (newPost.title && newPost.contents) {
        try {
            const post = await Posts.insert(req.body);
            res.status(201).json(post);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'There was an error while saving the post to the database'
            }); 
        }
    } else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find(req.query);
        res.status(200).json(posts);
    } catch (error) {
        //log error to database
        console.log(error);
        res.status(500).json({
            error: "The posts information could not be retrieved."
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "The post information could not be retrieved."
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const count = await Posts.remove(req.params.id);
        if (count > 0) {
            res.status(200).json({ message: "The post has been nuked" });
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "The post could not be removed"
        });
    }
});

router.put('/:id', async (req, res) => {
    const updatedInfo = { ...req.body};
    if (updatedInfo.title && updatedInfo.contents) {
        try {
            const count = await Posts.update(req.params.id);
            if (count > 0) {
                res.status(200).json(saved);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        } catch (err) {
            res.status(500).json({ error: "The post information could not be modified." })
        } 
}   else {
    res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
    });
}
});

module.exports = router;
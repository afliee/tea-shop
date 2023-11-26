import { Story, Tag } from "#models/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";

class StoryController {
	constructor() {}

	addTag = async (req, res) => {
		try {
			const { name } = req.body;
			console.log("Add tag", name);
			const tag = new Tag({
				name,
			});
			// check if tag already exists
			const tagExists = await Tag.findOne({ name });
			if (tagExists) {
				return res.status(400).json(ErrorMessage(400, "Tag already exists"));
			}
			await tag.save();
			req.flash("message", "Successfully created tag");
			req.flash("type", "success");
			return res.status(200).json(tag);
		} catch (e) {
			return res.status(500).json(ErrorMessage(500, e.message, e));
		}
	};

	getAllTag = async (req, res) => {
		try {
			const tags = await Tag.find();
			return res.status(200).json(tags);
		} catch (e) {
			return res.status(500).json(ErrorMessage(500, e.message, e));
		}
	};

	add = async (req, res) => {
		try {
			const { title, sortDescription, blockContent, tag } = req.body;
			// check if story already exists
			const storyExists = await Story.findOne({ title });
			if (storyExists) {
				return res.status(400).json(ErrorMessage(400, "Story already exists"));
			}
			const story = new Story({
				title,
				sortDescription,
				blockContent,
				tag,
			});
			await story.save();
			req.flash("message", "Successfully created story");
			req.flash("type", "success");
			// return res.redirect("/admin/stories");
			return res.status(200).json(story);
		} catch (e) {
			return res.status(500).json(ErrorMessage(500, e.message, e));
		}
	};

	index = async (req, res) => {
		try {
			const stories = await Story.find().populate("tag");
			const tags = await Tag.find();
			return res.render("layouts/admin/stories.ejs", {
				user: req.user,
				stories,
				tags,
				flash: {
					message: req.flash("message") || null,
					type: req.flash("type") || null,
				},
			});
		} catch (e) {
			return res.status(500).json(ErrorMessage(500, e.message, e));
		}
	};

	addStory = async (req, res) => {
		try {
			const tags = await Tag.find();
			return res.render("layouts/util/add-story.ejs", {
				user: req.user,
				tags,
				flash: {
					message: req.flash("message") || null,
					type: req.flash("type") || null,
				},
			});
		} catch (e) {
			return res.status(500).json(ErrorMessage(500, e.message, e));
		}
	};

	getAllStories = async (req, res) => {
		try {
			const stories = await Story.find().populate("tag");
			return res.status(200).json(stories);
		} catch (e) {
			return res.status(500).json(ErrorMessage(500, e.message, e));
		}
	};

	update = async (req, res) => {
		try {
			const id = req.params.id;
			console.log("id", id);
			const { title, sortDescription, blockContent, tag } = req.body;

			const story = await Story.findById(id);
			if (!story) {
				req.flash("message", "Story not found");
				req.flash("type", "error");
				return res.redirect("/admin/stories");
			}

			story.title = title;
			story.sortDescription = sortDescription;
			story.blockContent = blockContent;
			story.tag = tag;

			await story.save();
			req.flash("message", "Successfully updated story");
			req.flash("type", "success");
			// return res.redirect("/admin/stories");
			return res.status(200).json({
				status: 200,
				message: "Successfully updated story",
				data: story,
			});
		} catch (e) {
			return res.status(500).json(ErrorMessage(500, e.message, e));
		}
	};

	delete = async (req, res) => {
		try {
			const id = req.params.id;
			const stories = await Story.findByIdAndDelete(id);

			if (!stories) {
				req.flash("message", "Story not found");
				req.flash("type", "error");
				return res.redirect("/admin/stories");
			}

			req.flash("message", "Successfully deleted story");
			req.flash("type", "success");
			// return res.redirect("/admin/stories");
			return res.status(200).json(stories);
		} catch (e) {
			return res.status(500).json(ErrorMessage(500, e.message, e));
		}
	};

	show = async (req, res) => {
		try {
			const id = req.params.id;
			const story = await Story.findById(id).populate("tag");
			const tags = await Tag.find();

			if (!story) {
				req.flash("message", "Story not found");
				req.flash("type", "error");
				return res.redirect("/admin/stories");
			}

			return res.render("layouts/util/update-story.ejs", {
				user: req.user,
				story,
				tags,
				flash: {
					message: req.flash("message") || null,
					type: req.flash("type") || null,
				},
			});
		} catch (e) {
			return res.status(500).json(ErrorMessage(500, e.message, e));
		}
	};

	toggleActive = async (req, res) => {
        try {
            const id = req.params.id;
            const story = await Story.findById(id);
            if (!story) {
                return res.status(400).json(ErrorMessage(400, "Story not found"));
            }

            story.active = !story.active;
            await story.save();
            return res.status(200).json(story);
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e));
        }
    }

}


export default new StoryController();
import {Schema, model} from "mongoose";

// import ObjectId


export const Story = model(
	"Story",
	new Schema({
		title: {
			type: String,
			required: true,
			trim: true,
		},
		sortDescription: {
			type: String,
			required: true,
		},
		blockContent: [
			{
				title: {
					type: String,
				},
				content: {
					type: String,
				},
				url: {
					type: String,
				},
			},
		],
		tag: {
			type: Schema.Types.ObjectId,
			ref: "Tag",
		},
	})
);
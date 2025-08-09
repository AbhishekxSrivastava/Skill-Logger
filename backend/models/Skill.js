import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Skill title is required"],
    },
    description: {
      type: String,
    },
    duration: {
      type: Number, // In minutes
      required: [true, "Duration is required"],
    },
  },
  {
    timestamps: true,
  }
);


const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
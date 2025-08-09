import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import api from "../../api";
import Button from "../ui/Button";
import Input from "../ui/Input";

// --- 1. Define the component, receiving props ---
const LogSkillForm = ({ skill, onFormSubmit }) => {
  // --- 2. State to manage the form's input fields ---
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);

  // --- 3. A side effect to pre-fill the form when editing ---
  useEffect(() => {
    if (skill) {
      // If a 'skill' prop is passed, we're in "edit mode"
      setFormData({
        title: skill.title,
        description: skill.description,
        duration: skill.duration,
      });
    } else {
      // Otherwise, we're in "create mode", so ensure the form is empty
      setFormData({ title: "", description: "", duration: "" });
    }
  }, [skill]); // This effect re-runs whenever the 'skill' prop changes

  // --- 4. Standard handler for controlled inputs ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 5. Handle the form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (skill) {
        // If in "edit mode", send a PUT request
        await api.put(`/skills/${skill._id}`, formData);
      } else {
        // If in "create mode", send a POST request
        await api.post("/skills/log", formData);
      }
      onFormSubmit(); // Call the function passed from the parent to close the modal and refresh data
    } catch (error) {
      console.error("Failed to save skill", error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // --- 6. Render the form UI ---
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">
        {skill ? "Edit Skill Log" : "Log a New Skill"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Skill or Topic"
          value={formData.title}
          onChange={handleChange}
        />
        <Input
          name="description"
          placeholder="What did you learn?"
          value={formData.description}
          onChange={handleChange}
        />
        <Input
          name="duration"
          type="number"
          placeholder="Duration (in minutes)"
          value={formData.duration}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : skill ? "Update Log" : "Add Log"}{" "}
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default LogSkillForm;

import React, { useState, useContext } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { DataContext } from "../../context/DataContext";
import api from "../../api";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import Spinner from "../common/Spinner";
import LogSkillForm from "./LogSkillForm";

// --- 1. Define the Dashboard component ---
const DashboardPage = () => {
  // --- 2. Consume data from both contexts ---
  const { user } = useContext(AuthContext);
  const { skills, stats, loading, fetchData } = useContext(DataContext);

  // --- 3. Local state for managing the modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // --- 4. Functions to handle user actions ---
  const handleEdit = (skill) => {
    setEditingSkill(skill); // Put the selected skill into state
    setIsModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    // Use window.confirm for a simple confirmation dialog
    if (window.confirm("Are you sure you want to delete this log?")) {
      try {
        await api.delete(`/skills/${id}`);
        fetchData(); // Refresh the data after deleting
      } catch (error) {
        console.error("Failed to delete skill", error);
        alert("Failed to delete skill.");
      }
    }
  };

  const handleFormSubmit = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    fetchData(); // Refresh the data after adding/editing
  };

  // --- 5. Handle the initial loading state ---
  if (loading && !stats) {
    return (
      <div className="h-full">
        <Spinner />
      </div>
    );
  }

  // --- 6. Render the main dashboard UI ---
  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="font-bold text-gray-400">Logs This Week</h3>
          <p className="text-4xl font-bold text-blue-500">
            {stats?.weeklyCount || 0}
          </p>
        </Card>
        <Card>
          <h3 className="font-bold text-gray-400">Logs This Month</h3>
          <p className="text-4xl font-bold text-green-500">
            {stats?.monthlyCount || 0}
          </p>
        </Card>
        <Card className="md:col-span-2">
          <h3 className="font-bold text-gray-400 mb-2">Monthly Topics</h3>
          <div className="flex flex-wrap gap-2">
            {stats?.monthlyTopics?.length > 0 ? (
              stats.monthlyTopics.map((topic) => (
                <span
                  key={topic}
                  className="bg-gray-700 text-xs font-semibold px-2.5 py-1.5 rounded-full"
                >
                  {topic}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No topics logged this month.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Skills Log Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Learning Log</h2>
          <Button
            onClick={() => {
              setEditingSkill(null);
              setIsModalOpen(true);
            }}
          >
            <PlusCircle size={18} /> Log New Skill
          </Button>
        </div>
        <div className="space-y-4">
          {skills.length > 0 ? (
            skills.slice(0, 5).map((skill) => (
              <div
                key={skill._id}
                className="bg-gray-800/50 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold text-lg">{skill.title}</h4>
                  <p className="text-gray-400 text-sm">{skill.description}</p>
                  <p className="text-blue-400 font-semibold mt-1">
                    {skill.duration} minutes
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(skill)}>
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(skill._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              You haven't logged any skills yet. Get started!
            </p>
          )}
        </div>
      </Card>

      {/* The Modal for adding/editing skills */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LogSkillForm skill={editingSkill} onFormSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default DashboardPage;

'use client';

import { useState } from 'react';

interface EndorsementFormProps {
  onSubmit: (endorsement: {
    comment: string;
    skills: string[];
    relationship: string;
  }) => void;
}

const AVAILABLE_SKILLS = [
  'Technical Skills',
  'Physical Strength',
  'Speed',
  'Game Intelligence',
  'Leadership',
  'Team Player',
  'Work Ethic',
  'Tactical Understanding',
  'Ball Control',
  'Shooting',
  'Passing',
  'Defending'
];

export default function EndorsementForm({ onSubmit }: EndorsementFormProps) {
  const [comment, setComment] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [relationship, setRelationship] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !relationship || selectedSkills.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    if (comment.length < 10) {
      setError('Please provide a more detailed comment');
      return;
    }

    setError('');
    onSubmit({
      comment,
      skills: selectedSkills,
      relationship
    });

    // Reset form
    setComment('');
    setSelectedSkills([]);
    setRelationship('');
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else if (selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6">Add Endorsement</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Relationship*
          </label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">Select relationship</option>
            <option value="Coach">Coach</option>
            <option value="Team Captain">Team Captain</option>
            <option value="Teammate">Teammate</option>
            <option value="Opponent">Opponent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Skills* (max 5)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AVAILABLE_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Comment*
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            placeholder="Share your experience working with this athlete..."
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Submit Endorsement
        </button>
      </form>
    </div>
  );
} 
import React from 'react';

interface Message {
  id: string;
  sender: string;
  content: string;
  date: string;
}

interface Conversation {
  id: string;
  users: string[];
  messages: Message[];
}

const getCurrentUser = () => {
  // Pour MVP, on simule un utilisateur courant (à remplacer par l'auth plus tard)
  return typeof window !== 'undefined' ? localStorage.getItem('currentUser') || 'test@probreakthrough.com' : '';
};

export default function MessagesPage() {
  return <div style={{padding: 32}}>Messagerie désactivée pour le MVP.</div>;
} 
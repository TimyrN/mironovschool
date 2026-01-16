import { LucideIcon } from 'lucide-react';

export enum LinkCategory {
  SOCIAL = 'SOCIAL',
  COURSE = 'COURSE',
  CONTACT = 'CONTACT',
  RESOURCE = 'RESOURCE'
}

export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
  category: LinkCategory;
  color?: string; // Optional custom color for the button
  description?: string;
}

export interface TeacherProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  location: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
}
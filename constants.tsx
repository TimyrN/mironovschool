import avatarImage from './фото/photo_2026-01-12_00-50-33.jpg';
import guideEge from './pdf/ГАЙД ЕГЭ 2026.pdf';
import guideOge from './pdf/Гайд_ОГЭ_2026.pdf';
import {
  Instagram,
  Youtube,
  Send,
  Mail,
  BookOpen,
  Video,
  FileText,

  Twitter,
  Linkedin,
  Star
} from 'lucide-react';
import { SocialLink, LinkCategory, TeacherProfile } from './types';

export const TEACHER_PROFILE: TeacherProfile = {
  name: "Артём Миронов",
  title: "Учитель Математики & Репетитор",
  bio: "Проф.подготовка к ОГЭ | ЕГЭ 2026-2027 ✔️",
  avatarUrl: avatarImage,
  location: "Москва, Онлайн"
};

export const SOCIAL_LINKS: SocialLink[] = [

  {
    id: '2',
    title: 'Мой Telegram канал',
    url: 'https://t.me/Mironov_Artem_Alekseich',
    icon: Send,
    category: LinkCategory.SOCIAL,
    color: 'bg-sky-500 hover:bg-sky-600 text-white',
    description: 'Ежедневные задачи и разборы'
  },
  {
    id: '3',
    title: 'YouTube Уроки',
    url: 'https://youtube.com/@math.mironov?si=sFQqTHmLljUhFPhn',
    icon: Youtube,
    category: LinkCategory.SOCIAL,
    color: 'bg-red-600 hover:bg-red-700 text-white',
    description: 'Бесплатные видеоразборы вариантов'
  },

  {
    id: '5',
    title: 'Instagram',
    url: 'https://www.instagram.com/artewironov/',
    icon: Instagram,
    category: LinkCategory.SOCIAL,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white'
  },
  {
    id: '6',
    title: 'VKontakte',
    url: 'https://vk.ru/artem_mironov725',
    icon: BookOpen, // Placeholder for VK icon usually
    category: LinkCategory.SOCIAL,
    color: 'bg-blue-500 hover:bg-blue-600 text-white'
  },
  {
    id: '7',
    title: 'ГАЙД ЕГЭ 2026',
    url: guideEge,
    icon: FileText,
    category: LinkCategory.RESOURCE,
    color: 'bg-slate-200 hover:bg-slate-300 text-slate-800'
  },
  {
    id: '9',
    title: 'Гайд_ОГЭ_2026',
    url: guideOge,
    icon: FileText,
    category: LinkCategory.RESOURCE,
    color: 'bg-slate-200 hover:bg-slate-300 text-slate-800'
  },
  {
    id: '8',
    title: 'Профиль на Profi.ru',
    url: 'https://profi.ru/profile/MironovAA71/',
    icon: Star,
    category: LinkCategory.SOCIAL,
    color: 'bg-indigo-600 hover:bg-indigo-700 text-white'
  }
];

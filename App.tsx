import React, { useMemo, useState } from 'react';
import { MapPin, Globe, Share2, MessageCircle } from 'lucide-react';
import Avatar from './components/Avatar';
import LinkCard from './components/LinkCard';
import ContactModal from './components/ContactModal';

import { SOCIAL_LINKS, TEACHER_PROFILE } from './constants';
import { LinkCategory } from './types';

const App: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const groupedLinks = useMemo(() => {
    const courses = SOCIAL_LINKS.filter(l => l.category === LinkCategory.COURSE);
    const resources = SOCIAL_LINKS.filter(l => l.category === LinkCategory.RESOURCE);
    const contact = SOCIAL_LINKS.filter(l => l.category === LinkCategory.CONTACT || l.category === LinkCategory.SOCIAL);
    return { courses, resources, contact };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: TEACHER_PROFILE.name,
          text: `Check out ${TEACHER_PROFILE.name}'s profile!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert('Скопировано в буфер обмена!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Abstract Background Shapes */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-emerald-200/30 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col shadow-2xl bg-slate-50/80 backdrop-blur-sm">

        {/* Header Section */}
        <header className="pt-12 pb-8 px-6 text-center flex flex-col items-center relative">
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <Avatar
            src={TEACHER_PROFILE.avatarUrl}
            alt={TEACHER_PROFILE.name}
            size="xl"
            className="mb-6 shadow-xl ring-4 ring-white"
          />

          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
            {TEACHER_PROFILE.name}
          </h1>

          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-4 tracking-wide">
            {TEACHER_PROFILE.title}
          </span>

          <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto mb-6 font-light">
            {TEACHER_PROFILE.bio}
          </p>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Связаться
          </button>

        </header>

        {/* Links Section */}
        <main className="flex-1 px-4 pb-12 space-y-8">

          {groupedLinks.courses.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                Обучение и Курсы
              </h2>
              {groupedLinks.courses.map(link => (
                <LinkCard key={link.id} link={link} />
              ))}
            </section>
          )}

          {groupedLinks.resources.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                Полезные материалы
              </h2>
              {groupedLinks.resources.map(link => (
                <LinkCard key={link.id} link={link} />
              ))}
            </section>
          )}

          {groupedLinks.contact.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                Социальные сети и Контакты
              </h2>
              {groupedLinks.contact.map(link => (
                <LinkCard key={link.id} link={link} />
              ))}
            </section>
          )}

        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-slate-400 text-xs">
          <p>© {new Date().getFullYear()} {TEACHER_PROFILE.name}</p>
          <p className="mt-1 opacity-50">Все права защищены | v2.1</p>
        </footer>

      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

    </div>
  );
};

export default App;
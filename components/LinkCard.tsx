import React from 'react';
import { SocialLink } from '../types';
import { ExternalLink } from 'lucide-react';

interface LinkCardProps {
  link: SocialLink;
}

const LinkCard: React.FC<LinkCardProps> = ({ link }) => {
  const Icon = link.icon;
  
  return (
    <a 
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group relative flex items-center p-4 mb-3 w-full rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
        ${link.color ? link.color : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200'}
      `}
    >
      <div className="flex-shrink-0 mr-4">
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-grow text-left">
        <div className="font-semibold text-base">{link.title}</div>
        {link.description && (
          <div className="text-xs opacity-90 mt-0.5 font-light">{link.description}</div>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ExternalLink className="w-4 h-4" />
      </div>
    </a>
  );
};

export default LinkCard;
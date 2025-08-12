import React from 'react';
import { useRouter } from '../../hooks/useRouter';
import { useLanguage } from '../../contexts/LanguageContext';

interface LocalizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  locale?: string;
  replace?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  target?: string;
  rel?: string;
}

/**
 * Composant Link localisé
 * Génère automatiquement les liens avec la langue appropriée
 */
export const LocalizedLink: React.FC<LocalizedLinkProps> = ({
  href,
  children,
  className = '',
  locale,
  replace = false,
  onClick,
  target,
  rel
}) => {
  const { navigate, generateLink, isActive } = useRouter();
  const { currentLanguage } = useLanguage();

  const handleClick = (e: React.MouseEvent) => {
    // Permettre l'ouverture dans un nouvel onglet avec Ctrl/Cmd + clic
    if (e.ctrlKey || e.metaKey || target === '_blank') {
      return;
    }

    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    }

    navigate(href, { replace, locale });
  };

  const localizedHref = generateLink(href, locale);
  const active = isActive(href);

  return (
    <a
      href={localizedHref}
      onClick={handleClick}
      className={`${className} ${active ? 'active' : ''}`}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
};

/**
 * Hook pour générer des liens localisés
 */
export const useLocalizedLinks = () => {
  const { generateLink } = useRouter();
  const { currentLanguage } = useLanguage();

  const createLink = (path: string, locale?: string) => {
    return generateLink(path, locale || currentLanguage.code);
  };

  const createLinks = (path: string) => {
    return {
      fr: generateLink(path, 'fr'),
      en: generateLink(path, 'en'),
      current: generateLink(path, currentLanguage.code)
    };
  };

  return {
    createLink,
    createLinks,
    currentLanguage: currentLanguage.code
  };
};
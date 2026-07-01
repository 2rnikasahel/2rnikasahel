import { Link } from 'react-router-dom';
import { useContact } from '../context/ContactContext';
import ContactContent from '../components/contact/ContactContent';

export function ContactPage() {
  const { settings } = useContact();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6" aria-label="مسیر breadcrumb">
        <Link to="/" className="hover:text-accent">خانه</Link>
        <span>/</span>
        <span className="text-primary font-medium">{settings.title}</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-3">{settings.title}</h1>
        <p className="text-text-secondary">{settings.subtitle}</p>
      </div>

      <ContactContent />
    </div>
  );
}

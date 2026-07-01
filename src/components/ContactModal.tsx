import { X } from 'lucide-react';
import { useContact } from '../context/ContactContext';
import ContactContent from './contact/ContactContent';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { settings } = useContact();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fade-in-up"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-light-bg rounded-full flex items-center justify-center text-text-secondary hover:text-danger hover:bg-red-50 transition-all"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-8 pb-4 px-6">
          <h2 className="text-2xl font-bold text-primary mb-2">{settings.title}</h2>
          <p className="text-text-secondary text-sm">{settings.subtitle}</p>
        </div>

        <div className="px-6 pb-6">
          <ContactContent compact />
        </div>
      </div>
    </div>
  );
}

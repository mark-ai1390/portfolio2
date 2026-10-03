import { Heading } from './ui/heading';
import { author } from '../data/portfolio';

export function AuthorPanel() {
  return (
    <header className="author-panel">
      <div className="author-intro">
        <Heading level={2}>{author.discipline}</Heading>
        <p className="specialties">{author.areas.join(', ')}</p>
        <p className="author-description">{author.description}</p>
        <nav className="contacts" aria-label="Связаться с Марком">
          <span className="contact-unavailable" aria-disabled="true" title="Файл резюме ещё не добавлен">Резюме</span>
          {author.contacts.map(contact => (
            <a
              key={contact.label}
              href={contact.href}
              {...(contact.href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {contact.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="author-identity">
        <div className="author-portrait">
          <img src={author.portrait} alt="Марк Сангинов" width="153" height="153" />
        </div>
        <p className="author-name">{author.name}</p>
      </div>
    </header>
  );
}

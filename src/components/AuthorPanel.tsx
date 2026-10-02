import { author } from '../data/portfolio';

export function AuthorPanel() {
  return (
    <header className="author-panel">
      <div className="author-intro">
        <h1>{author.discipline}</h1>
        <ul className="specialties" aria-label="Направления работы">
          {author.areas.map(area => <li key={area}>{area}</li>)}
        </ul>
        <nav className="contacts" aria-label="Связаться с Марком">
          {author.contacts.map(contact => (
            <a
              key={contact.label}
              href={contact.href}
              {...(contact.href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {contact.label}
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12 12 4M4 4h8v8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          ))}
        </nav>
      </div>
      <p className="author-name">{author.name}</p>
    </header>
  );
}

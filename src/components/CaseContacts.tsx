import { CaseHeading } from './CaseHeading';
import { author } from '../data/portfolio';

export function CaseContacts() {
  return <section className="case-contacts" aria-labelledby="contacts-title">
    <CaseHeading id="contacts-title">Контакты</CaseHeading>
    <p>Открыт к новым проектам и сотрудничеству.<br />Готов обсудить фриланс, full-time и консалтинг.</p>
    <div className="case-contact-links">{author.contacts.map(contact => <a href={contact.href} key={contact.label} target={contact.label === 'Telegram' ? '_blank' : undefined} rel={contact.label === 'Telegram' ? 'noopener noreferrer' : undefined}>
      <span className="case-contact-icon"><img src={`/assets/cases/contact-${contact.label.toLowerCase()}.svg`} alt="" width="18" height="18" /></span>
      {contact.label === 'Email' ? 'ligeon199815@gmail.com' : '@Markro1998'}
    </a>)}</div>
  </section>;
}

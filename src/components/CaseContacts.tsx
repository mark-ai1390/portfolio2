import { typography } from '../lib/typography';
import { CaseHeading } from './CaseHeading';
import { author } from '../data/portfolio';

export function CaseContacts() {
  return <section className="case-contacts" aria-labelledby="contacts-title">
    <CaseHeading id="contacts-title">Контакты</CaseHeading>
    <p>{typography('Открыт к новым проектам и постоянной работе. Готов обсудить задачи и подробнее рассказать о проектах.')}</p>
    <div className="case-contact-links">{author.contacts.map(contact => <a href={contact.href} key={contact.label} target={contact.label === 'Telegram' ? '_blank' : undefined} rel={contact.label === 'Telegram' ? 'noopener noreferrer' : undefined}>
      {contact.label === 'Email' ? 'ligeon199815@gmail.com' : '@Markro1998'}
    </a>)}</div>
  </section>;
}

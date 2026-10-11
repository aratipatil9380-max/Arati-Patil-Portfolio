import { beyondItems } from '../../content/beyond';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

export function BeyondTech() {
  return (
    <section id="beyond" className="section section--alt" aria-labelledby="beyond-title">
      <div className="container">
        <SectionHeading
          id="beyond-title"
          index="06"
          eyebrow="Beyond tech"
          title="Create"
          lede="The third movement. Drawing, acting, and street theatre — where the work turns expressive."
        />

        <div className="section__block">
          <ul className="beyond-list">
            {beyondItems.map((item, i) => (
              <Reveal
                as="li"
                key={item.id}
                variant="clip"
                delay={i * 70}
                className="beyond-entry"
              >
                <span className="beyond-entry__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="beyond-entry__label">{item.label}</span>
                <span className="beyond-entry__note">{item.note}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { achievements, tierLabel } from '../../content/achievements';
import type { Achievement } from '../../content/achievements';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

function AchievementBody({ item, index }: { item: Achievement; index: string }) {
  return (
    <>
      <p className="achievement__meta">
        <span className="achievement__index">{index}</span>
        <span aria-hidden="true">/</span>
        <span>{item.event}</span>
      </p>
      <h3 className="achievement__title">{item.title}</h3>
      <p className="achievement__scope">{tierLabel[item.scope]}</p>
      <p className="achievement__detail">{item.detail}</p>
    </>
  );
}

export function Achievements() {
  const lead = achievements.find((a) => a.tier === 'lead');
  const secondary = achievements.filter((a) => a.tier === 'secondary');
  const minor = achievements.filter((a) => a.tier === 'minor');

  const num = (i: number) => String(i + 1).padStart(2, '0');

  return (
    <section
      id="achievements"
      className="section section--alt"
      aria-labelledby="achievements-title"
    >
      <div className="container">
        <SectionHeading
          id="achievements-title"
          index="02"
          eyebrow="Achievements"
          title="Participation"
          lede="Events and challenges I have taken part in, with team and solo involvement labelled."
        />

        <div className="achievements">
          {lead ? (
            <Reveal
              as="article"
              variant="clip"
              className={`achievement achievement--lead achievement--${lead.scope}`}
            >
              <AchievementBody item={lead} index={num(0)} />
            </Reveal>
          ) : null}

          {secondary.map((item, i) => (
            <Reveal
              as="article"
              key={item.id}
              variant="rise"
              delay={(1 + i) * 70}
              className={`achievement achievement--secondary achievement--${item.scope}`}
            >
              <AchievementBody item={item} index={num(1 + i)} />
            </Reveal>
          ))}

          {minor.length ? (
            <ul className="achievement-minor">
              {minor.map((item, i) => (
                <Reveal
                  as="li"
                  key={item.id}
                  variant="scale"
                  delay={(1 + secondary.length + i) * 70}
                  className={`achievement achievement--minor achievement--${item.scope}`}
                >
                  <AchievementBody
                    item={item}
                    index={num(1 + secondary.length + i)}
                  />
                </Reveal>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

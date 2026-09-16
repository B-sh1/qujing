import { economy } from "../data/content.js";
import { Reveal, RevealMedia } from "./Reveal.jsx";
import SectionIntro from "./SectionIntro.jsx";

function Keys({ keys }) {
  return (
    <div className="card__keys">
      {keys.map((k) => (
        <span className="card__key" key={k}>
          {k}
        </span>
      ))}
    </div>
  );
}

export default function Economy() {
  const { index, title, lead, feature, cards, closing } = economy;

  return (
    <section className="section" id="economy-detail">
      <div className="container">
        <SectionIntro index={index} title={title} lead={lead} />

        <div className="economy__grid">
          <Reveal className="card card--feature" y={30}>
            <div className="rural__text">
              <span className="card__index">{feature.index}</span>
              <h3 className="display h3">{feature.title}</h3>
              <p className="card__body">{feature.body}</p>
              <Keys keys={feature.keys} />
            </div>
            <RevealMedia
              src={feature.image}
              alt={feature.alt}
              sizes="(max-width: 760px) 100vw, 520px"
            />
          </Reveal>

          {cards.map((card, i) =>
            card.image ? (
              <Reveal
                className="card card--feature"
                key={card.title}
                delay={0.05 + i * 0.04}
                y={30}
              >
                <div className="rural__text">
                  <span className="card__index">{card.index}</span>
                  <h3 className="display h3">{card.title}</h3>
                  <p className="card__body">{card.body}</p>
                  <Keys keys={card.keys} />
                </div>
                <RevealMedia
                  src={card.image}
                  alt={card.alt}
                  sizes="(max-width: 760px) 100vw, 520px"
                />
              </Reveal>
            ) : (
              <Reveal className="card" key={card.title} delay={0.05 + i * 0.04}>
                <span className="card__index">{card.index}</span>
                <h3 className="display h3">{card.title}</h3>
                <p className="card__body">{card.body}</p>
                <Keys keys={card.keys} />
              </Reveal>
            )
          )}

          <Reveal className="economy__outro" delay={0.06} y={24}>
            <h3 className="display h3">{closing.title}</h3>
            <p className="economy__outro-body">{closing.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { rural, asset } from "../data/content.js";
import { Reveal, RevealMedia } from "./Reveal.jsx";
import SectionIntro from "./SectionIntro.jsx";

export default function Rural() {
  const { index, title, lead, blocks } = rural;

  return (
    <section className="section rural" id="rural-detail">
      <div className="container">
        <SectionIntro index={index} title={title} lead={lead} />

        <div className="rural__blocks">
          {blocks.map((block, i) => (
            <article className="rural__block" key={block.title}>
              <div className="rural__text">
                <Reveal as="span" className="rural__tag" y={12}>
                  {block.tag}
                </Reveal>
                <Reveal as="h3" className="display h3" delay={0.06}>
                  {block.title}
                </Reveal>
                <Reveal as="p" className="body" delay={0.12}>
                  {block.body}
                </Reveal>
                <Reveal as="span" className="rural__meta" delay={0.18} y={12}>
                  {block.meta}
                </Reveal>
              </div>

              <div className="rural__media">
                <RevealMedia
                  src={block.image}
                  alt={block.alt}
                  className="media--tall"
                  delay={i * 0.04}
                />
                {block.image2 ? (
                  <RevealMedia
                    src={block.image2}
                    alt={block.alt2}
                    className="media--portrait rural__media-extra"
                    delay={i * 0.04 + 0.08}
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="rural__band">
          <RevealMedia
            src={asset("/images/shizong-rice.jpg")}
            alt="师宗稻田：夕照下的水田、村庄与山影"
            className="media--band"
          />
          <div className="rural__band-note">
            <span>水在田间，村在山根</span>
            <span>师宗 · 稻田</span>
          </div>
        </div>
      </div>
    </section>
  );
}

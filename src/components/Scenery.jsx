import { scenery } from "../data/content.js";
import { Reveal, RevealMedia } from "./Reveal.jsx";
import SectionIntro from "./SectionIntro.jsx";

function Figure({ image, className, delay = 0 }) {
  return (
    <figure style={{ margin: 0 }}>
      <RevealMedia src={image.src} alt={image.alt} className={className} delay={delay} />
      {image.place ? (
        <Reveal as="figcaption" className="caption" delay={delay + 0.12} y={14}>
          <span className="caption__place">{image.place}</span>
          <span className="caption__note">{image.note}</span>
        </Reveal>
      ) : null}
    </figure>
  );
}

export default function Scenery() {
  const { index, title, lead, lead2, images } = scenery;

  return (
    <section className="section" id="scenery-detail">
      <div className="container">
        <SectionIntro index={index} title={title} lead={lead} />

        <div className="scenery__stack">
          <div className="scenery__caoshan">
            <RevealMedia
              src={images.grassland.src}
              alt={images.grassland.alt}
              className="media--landscape"
            />
            <div className="scenery__caoshan-aside">
              <RevealMedia
                src={images.grasslandStream.src}
                alt={images.grasslandStream.alt}
                className="media--portrait caoshan-stream"
                delay={0.08}
              />
              <RevealMedia
                src={images.grasslandValley.src}
                alt={images.grasslandValley.alt}
                className="media--portrait caoshan-valley"
                delay={0.16}
              />
            </div>
            <Reveal as="figcaption" className="caption caption--below" delay={0.2} y={14}>
              <span className="caption__place">{images.grassland.place}</span>
              <span className="caption__note">{images.grassland.note}</span>
            </Reveal>
          </div>

          <div className="scenery__interlude">
            <Reveal className="scenery__quote" y={20}>
              <p>{lead2}</p>
              <span>乌蒙山南延 · 南盘江上游</span>
            </Reveal>
            <RevealMedia
              src={images.reservoir.src}
              alt={images.reservoir.alt}
              className="media--landscape"
              delay={0.08}
            />
          </div>

          <div className="scenery__pair">
            <Figure image={images.waterfall} className="media--wide scenery__waterfall" />
            <Figure image={images.zhujiangyuan} className="media--wide scenery__zhujiangyuan" delay={0.12} />
          </div>

        </div>
      </div>
    </section>
  );
}

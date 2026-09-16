import { summer } from "../data/content.js";
import { Reveal, RevealMedia } from "./Reveal.jsx";
import SectionIntro from "./SectionIntro.jsx";

export default function Summer() {
  const { index, title, lead, lede, ledeImage, notes, closing } = summer;

  return (
    <section className="section summer" id="summer">
      <div className="container">
        <SectionIntro index={index} title={title} lead={lead} />

        <div className="summer__lede">
          <Reveal className="summer__lede-text" y={22}>
            <p>{lede}</p>
          </Reveal>
          {ledeImage ? (
            <RevealMedia
              src={ledeImage.src}
              alt={ledeImage.alt}
              className="media--portrait summer__lede-media"
              delay={0.1}
            />
          ) : null}
        </div>

        <div className="summer__notes">
          {notes.map((note) => (
            <Reveal
              className={`summer__note${note.image ? " summer__note--with-media" : ""}`}
              as="article"
              key={note.title}
              y={24}
            >
              <div className="summer__note-aside">
                <div className="summer__note-head">
                  <span className="summer__note-index">{note.index}</span>
                  <h3 className="display h3 summer__note-title">{note.title}</h3>
                </div>
                {note.image ? (
                  <RevealMedia
                    src={note.image}
                    alt={note.alt}
                    className="summer__note-media"
                    style={note.imageRatio ? { aspectRatio: note.imageRatio } : undefined}
                    delay={0.08}
                  />
                ) : null}
              </div>
              <div className="summer__note-body">
                {note.paragraphs.map((text) => (
                  <p className="body" key={text}>
                    {text}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="summer__closing" y={24}>
          <p>{closing}</p>
        </Reveal>
      </div>
    </section>
  );
}

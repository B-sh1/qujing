import { Reveal } from "./Reveal.jsx";

export default function SectionIntro({ index, title, lead }) {
  const lines = String(title).split("\n");

  return (
    <div className="section-head">
      <div className="section-head__title">
        <Reveal as="span" className="index-label" y={12}>
          {index}
        </Reveal>
        <Reveal as="h2" className="display h2" delay={0.06}>
          {lines.map((line, i) => (
            <span className="section-head__line" key={line}>
              {i > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </Reveal>
      </div>
      {lead ? (
        <Reveal as="p" className="lead" delay={0.14}>
          {lead}
        </Reveal>
      ) : null}
    </div>
  );
}

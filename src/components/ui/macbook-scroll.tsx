import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CaseIllustration } from '../CaseIllustration';
import { caseImage } from '../../lib/case-image';
import { CaseImageLink } from '../CaseImageViewer';
import './macbook-scroll.css';

type MacbookScrollProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  nodeId: string;
};

const MotionImageLink = motion.create(CaseImageLink);

// The screen-to-page transition follows the Aceternity Macbook Scroll reference.
// Geometry and scroll distance are adapted to this case's container and viewport.
export function MacbookScroll(props: MacbookScrollProps) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <CaseIllustration {...props} />;
  return <AnimatedMacbook {...props} />;
}

function AnimatedMacbook({ src, alt, width, height, nodeId }: MacbookScrollProps) {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [stageMetrics, setStageMetrics] = useState({ top: 0, height: 800 });
  useLayoutEffect(() => {
    const element = stage.current;
    if (!element) return;
    const measure = () => {
      const top = parseFloat(getComputedStyle(element).top) || 0;
      const height = element.getBoundingClientRect().height;
      setStageMetrics(previous => previous.top === top && previous.height === height ? previous : { top, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  const { scrollYProgress } = useScroll({ target: track, offset: [
    `start ${stageMetrics.top}px`, `end ${stageMetrics.top + stageMetrics.height}px`,
  ] });
  const scale = useTransform(scrollYProgress, [0, .68], [.72, 1]);
  const rotateX = useTransform(scrollYProgress, [0, .1, .68], [-28, -28, 0]);
  const y = useTransform(scrollYProgress, [0, .68], ['-12%', '0%']);
  const hardwareOpacity = useTransform(scrollYProgress, [.18, .58], [1, 0]);
  const baseY = useTransform(scrollYProgress, [0, .58], ['0%', '24%']);

  return <figure ref={track} className="macbook-scroll" data-figma-node={nodeId}
    style={{ '--macbook-screen-ratio': `${width} / ${height}` } as CSSProperties}>
    <div ref={stage} className="macbook-scroll-stage">
      <div className="macbook-scroll-scene">
        <motion.div className="macbook-base-position" style={{ opacity: hardwareOpacity, y: baseY }} aria-hidden="true">
          <div className="macbook-base">
            <div className="macbook-speaker macbook-speaker--left" />
            <LaptopKeyboard />
            <div className="macbook-speaker macbook-speaker--right" />
            <div className="macbook-trackpad" />
            <div className="macbook-base-notch" />
          </div>
        </motion.div>
        <MotionImageLink className="macbook-display-link" image={{ src, alt, width, height }} style={{ scale, rotateX, y }}>
          <motion.span className="macbook-screen-frame" style={{ opacity: hardwareOpacity }} aria-hidden="true">
            <span className="macbook-camera" />
          </motion.span>
          <img {...caseImage(src)} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        </MotionImageLink>
      </div>
    </div>
  </figure>;
}

const keyboardRows = [
  ['esc', '☀', '☀', '▦', '⌕', '◉', '☾', '◀', '▶', '▶', '◖', '◗', '⏻'],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '−', '=', 'delete'],
  ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'return'],
  ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift'],
  ['fn', 'ctrl', 'opt', 'cmd', '', 'cmd', 'opt', '←', '↕', '→'],
];

function LaptopKeyboard() {
  return <div className="macbook-keyboard">
    {keyboardRows.map((row, rowIndex) => <div className="macbook-key-row" key={rowIndex}>
      {row.map((key, index) => <span key={index} className={`macbook-key${key === '' ? ' macbook-key--space' : ''}${key.length > 1 ? ' macbook-key--wide' : ''}`}>{key}</span>)}
    </div>)}
  </div>;
}

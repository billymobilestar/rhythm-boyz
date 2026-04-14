"use client";

import { motion, type Variants } from "framer-motion";

type Preset = "slide-up" | "typewriter" | "wave";

interface AnimatedHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  preset?: Preset;
  className?: string;
}

export default function AnimatedHeading({
  text,
  as: Tag = "h2",
  preset = "slide-up",
  className = "",
}: AnimatedHeadingProps) {
  if (preset === "slide-up") {
    return <SlideUp text={text} Tag={Tag} className={className} />;
  }
  if (preset === "typewriter") {
    return <Typewriter text={text} Tag={Tag} className={className} />;
  }
  return <Wave text={text} Tag={Tag} className={className} />;
}

/* ── Slide-up (word stagger) ───────────────────────── */

function SlideUp({
  text,
  Tag,
  className,
}: {
  text: string;
  Tag: "h1" | "h2" | "h3";
  className: string;
}) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const child: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="inline-flex flex-wrap"
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={child} className="mr-[0.3em]">
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ── Typewriter (character stagger) ────────────────── */

function Typewriter({
  text,
  Tag,
  className,
}: {
  text: string;
  Tag: "h1" | "h2" | "h3";
  className: string;
}) {
  const chars = text.split("");

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03 } },
  };

  const child: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
  };

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {chars.map((char, i) => (
          <motion.span key={i} variants={child}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ── Wave (sine-wave y offset) ─────────────────────── */

function Wave({
  text,
  Tag,
  className,
}: {
  text: string;
  Tag: "h1" | "h2" | "h3";
  className: string;
}) {
  const chars = text.split("");

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
  };

  const child: Variants = {
    hidden: { y: 0 },
    visible: (i: number) => ({
      y: [0, -12, 0],
      transition: {
        delay: i * 0.04,
        duration: 0.6,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="inline-flex"
      >
        {chars.map((char, i) => (
          <motion.span key={i} variants={child} custom={i}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, x: "-100%", transition: { staggerChildren: 0.05 } },
  show: {
    opacity: 1,
    x: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, x: "-30%" },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

function List({ open }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate={open ? "show" : "hidden"}
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <motion.ul
        variants={container}
        initial="hidden"
        animate={open ? "show" : "hidden"}
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
        className="w-full items-stretch"
      >
        <a href="#tarifs" className="menu-link">
          Nos tarifs
        </a>
        <a href="#contact" className="menu-link">
          Nous contacter
        </a>
        <a
          href="#demander"
          className="menu-link font-bold text-[18px] bg-white shadow-md"
        >
          Demander un site
        </a>
      </motion.ul>
    </motion.ul>
  );
}

export function Menu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const activationZoneWidth = 300;

  function handleActivationZoneEnter() {
    setOpen(true);
  }

  function handleMenuLeave(e) {
    const next = e.relatedTarget;
    if (
      next === null ||
      !(next instanceof Node) ||
      (menuRef.current && !menuRef.current.contains(next))
    ) {
      setOpen(false);
    }
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: activationZoneWidth,
          height: "100vh",
          zIndex: 99,
          background: "transparent",
        }}
        onMouseEnter={handleActivationZoneEnter}
        onMouseLeave={handleMenuLeave}
      >
        <motion.div
          initial={false}
          animate={{
            left: open ? 260 + 10 : 10,
          }}
          transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            width: 30,
            opacity: 0.7,
            zIndex: 120,
          }}
          aria-hidden="true"
        >
          <svg
            width="24"
            height="40"
            viewBox="0 0 24 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="8,10 16,20 8,30"
              stroke="#222"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </motion.div>
      </div>
      <motion.nav
        ref={menuRef}
        initial={false}
        animate={
          open
            ? { x: 0, opacity: 1, pointerEvents: "auto" }
            : { x: -260, opacity: 0, pointerEvents: "none" }
        }
        transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 260,
          height: "100vh",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "2px 0 16px rgba(0,0,0,0.12)",
          transition: "background .2s",
        }}
        onMouseLeave={handleMenuLeave}
        onMouseEnter={() => setOpen(true)}
      >
        <List open={open} />
      </motion.nav>
    </>
  );
}

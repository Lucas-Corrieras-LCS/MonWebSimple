import { Children } from "react";
import { motion } from "framer-motion";
import { useStore } from "./store";
import Image from "next/image";
import logo from "../../public/logo.svg";

const container = {
  hidden: { opacity: 0, height: 0, transition: { staggerChildren: 0.05 } },
  show: {
    opacity: 1,
    height: "auto",
    transition: { when: "beforeChildren", staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: "100%" },
  show: { opacity: 1, y: 0 },
};

function List({ children, open }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate={open ? "show" : "hidden"}
    >
      {Children.map(children, (child, i) => (
        <li key={i}>
          <motion.div variants={item}>{child}</motion.div>
        </li>
      ))}
    </motion.ul>
  );
}

export function Overlay() {
  const store = useStore();
  const now = new Date();
  const dateString = now.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <a
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            fontSize: "13px",
          }}
        >
          Brandon VO
          <br />
          Lucas CORRIERAS
        </a>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            fontSize: "13px",
          }}
        >
          {dateString}
        </div>
      </div>
      <Image
        src={logo}
        alt="Logo"
        style={{
          position: "absolute",
          top: 30,
          left: 35,
          width: 70,
          height: 70,
          filter: "grayscale(1) brightness(0)",
        }}
      />
      <div
        className="info"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
        }}
      >
        <h1 className="accent">Monwebsimple</h1>
        <List open={store.open}>
          <h3>Qui sommes</h3>
          <h3>nous?</h3>
          <h3>
            <span className="accent">Artisans du web</span>
          </h3>
          <h4>et bien plus encore</h4>
          <p>
            Nous sommes convaincus que chaque entreprise mérite une présence
            digitale unique. Notre approche allie simplicité, efficacité et
            proximité pour accompagner votre réussite en ligne.
          </p>
        </List>
      </div>
    </>
  );
}

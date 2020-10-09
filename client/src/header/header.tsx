import React, { FC } from "react";

export let Header: FC = () => {
  let as = [
    {
      content: "Home",
      href: "#home"
    },
    {
      content: "Tools",
      href: "#play-button"
    },
    {
      content: "About",
      href: "#about"
    }
  ];
  return (
    <header
      style={{
        backgroundColor: "#20232a",
        color: "#ffffff",
        position: "fixed",
        height: 40,
        width: "100%",
        top: 0
      }}
    >
      <div
        style={{
          margin: "0 20px",
          height: "100%"
        }}
      >
        <nav
          style={{
            display: "flex",
            height: "100%"
          }}
        >
          {as.map(i => (
            <a
              key={i.content}
              href={i.href}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#ffffff",
                padding: "0 8px",
                textDecoration: "none",
                fontWeight: 300
              }}
            >
              {i.content}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

import React, { FC, ReactElement, useReducer, useEffect } from "react";

type Props = {
  content: {
    element: ReactElement;
    id: string;
    title: string;
  }[];
  addNew: () => string;
  removeElement: (id: string) => void;
};

const BG_GRAY = "rgb(231, 234, 237)";
const TAB_HOVER = "rgb(245, 246, 247)";
const ICON_HOVER = "rgb(209, 210, 212)";
const PIPE = "rgb(144, 148, 151)";
const WHITE = "#ffffff";

export let Tabs: FC<Props> = ({ content, addNew, removeElement }) => {
  let [state, dispatch] = useReducer(
    (
      prev: {
        active: string;
        activeIdx: number;
        hoveredTab: string;
        hoveredTabIdx: number;
        hoveredIcon: string;
        hoveredPlus: boolean;
      },
      action:
        | ["setActive", string]
        | ["setHoveredTab", string]
        | ["setHoveredIcon", string]
        | ["setHoveredPlus", boolean]
    ) => {
      let [type, payload] = action;
      switch (type) {
        case "setActive":
          return {
            ...prev,
            active: payload,
            activeIdx: content.findIndex(i => i.id === payload)
          };
        case "setHoveredTab":
          return {
            ...prev,
            hoveredTab: payload,
            hoveredTabIdx: content.findIndex(i => i.id === payload)
          };
        case "setHoveredIcon":
          return { ...prev, hoveredIcon: payload };
        case "setHoveredPlus":
          return { ...prev, hoveredPlus: payload };
        default:
          return prev;
      }
    },
    {
      active: content[0].id,
      activeIdx: 0,
      hoveredTab: null,
      hoveredTabIdx: null,
      hoveredIcon: null,
      hoveredPlus: false
    }
  );

  let {
    active,
    activeIdx,
    hoveredTab,
    hoveredTabIdx,
    hoveredIcon,
    hoveredPlus
  } = state;

  let current = content.find(c => c.id === active) || content[0];

  useEffect(() => {
    if (current.id !== active) {
      dispatch(["setActive", current.id]);
    }
  }, [current, active]);

  return (
    <div style={{ display: "flex", cursor: "default" }}>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: BG_GRAY,
            paddingLeft: 8
          }}
        >
          {content.map((c, idx) => {
            let isActive = c.id === active;
            let isHoveredTab = c.id === hoveredTab;
            let isHoveredIcon = c.id === hoveredIcon;
            let ATO = <T,>(a: T, t: T, o: T) =>
              isActive ? a : isHoveredTab ? t : o;

            return (
              <div
                key={c.id}
                style={{
                  position: "relative",
                  zIndex: ATO(1000, 500, 100 - idx)
                }}
              >
                {idx - hoveredTabIdx !== 1 && (
                  <div
                    style={{
                      position: "absolute",
                      height: "100%",
                      left: -8,
                      backgroundColor: ATO(WHITE, TAB_HOVER, BG_GRAY)
                    }}
                  >
                    <div
                      style={{
                        borderRight: `solid ${BG_GRAY} 8px`,
                        borderRadius: "0 0 8px 0",
                        height: "100%"
                      }}
                    />
                  </div>
                )}
                <div
                  style={{
                    backgroundColor: ATO(WHITE, TAB_HOVER, BG_GRAY),
                    color: "rgb(95, 99, 104)",
                    padding: "0px 8px",
                    border: `solid ${ATO(WHITE, TAB_HOVER, BG_GRAY)} 8px`,
                    borderRadius: "8px 8px 0 0",
                    display: "flex",
                    alignItems: "center"
                  }}
                  onMouseOver={() => {
                    dispatch(["setHoveredTab", c.id]);
                  }}
                  onMouseLeave={() => {
                    dispatch(["setHoveredTab", null]);
                  }}
                  onClick={() => {
                    dispatch(["setActive", c.id]);
                  }}
                >
                  <span>{c.title}</span>
                  <span
                    style={{
                      marginLeft: "8px",
                      fontWeight: "bold",
                      width: 16,
                      height: 16,
                      lineHeight: "16px",
                      fontSize: 12,
                      borderRadius: "50%",
                      textAlign: "center",
                      background: isHoveredIcon ? ICON_HOVER : "transparent"
                    }}
                    onMouseOver={() => {
                      dispatch(["setHoveredIcon", c.id]);
                    }}
                    onMouseLeave={() => {
                      dispatch(["setHoveredIcon", null]);
                    }}
                    onClick={() => {
                      removeElement(c.id);
                    }}
                  >
                    ╳
                  </span>
                </div>
                {hoveredTabIdx - idx !== 1 && (
                  <div
                    style={{
                      position: "absolute",
                      height: "100%",
                      right: -8,
                      top: 0,
                      backgroundColor: ATO(WHITE, TAB_HOVER, BG_GRAY)
                    }}
                  >
                    <div
                      style={{
                        borderLeft: `solid ${BG_GRAY} 8px`,
                        borderRadius: "0 0 0 8px",
                        height: "100%"
                      }}
                    />
                  </div>
                )}
                {!isHoveredTab &&
                  (idx - activeIdx >= 1 || activeIdx - idx >= 2) && (
                    <div
                      style={{
                        position: "absolute",
                        right: -2,
                        top: 0,
                        height: "100%",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <span
                        style={{
                          lineHeight: 25,
                          color: PIPE
                        }}
                      >
                        |
                      </span>
                    </div>
                  )}
              </div>
            );
          })}
          <div
            style={{
              marginLeft: "8px",
              fontWeight: "bold",
              width: 24,
              height: 24,
              fontSize: 20,
              lineHeight: "24px",
              borderRadius: "50%",
              textAlign: "center",
              background: hoveredPlus ? ICON_HOVER : "transparent"
            }}
            onClick={() => {
              dispatch(["setActive", addNew()]);
            }}
            onMouseOver={() => {
              dispatch(["setHoveredPlus", true]);
            }}
            onMouseLeave={() => {
              dispatch(["setHoveredPlus", false]);
            }}
          >
            +
          </div>
        </div>
        <div style={{ backgroundColor: WHITE, padding: 20 }}>
          {current.element}
        </div>
      </div>
    </div>
  );
};

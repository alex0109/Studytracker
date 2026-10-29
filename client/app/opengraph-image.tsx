import { ImageResponse } from "next/og";

// The picture shown when a link to the site is shared. English only: the bundled font
// covers Latin, and one image serves every language
export const alt = "Studytracker — grow knowledge, reinforce it, make it last";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CHIPS = ["Notes", "Questions", "Flashcards", "Self defending", "Statistics"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          backgroundColor: "#fafafa",
          backgroundImage:
            // Each colour fades into its own transparent self: plain "transparent" is
            // transparent black and turned the blend grey
            "radial-gradient(circle at 12% 18%, rgba(198,196,255,1) 0%, rgba(198,196,255,0) 45%), radial-gradient(circle at 88% 12%, rgba(205,231,255,1) 0%, rgba(205,231,255,0) 42%), radial-gradient(circle at 80% 92%, rgba(255,208,205,1) 0%, rgba(255,208,205,0) 45%)",
          color: "#171717",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "8px 20px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.75)",
            color: "#047857",
            fontSize: 26,
          }}
        >
          A learning system, not a notebook
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 104, fontWeight: 700, letterSpacing: -3 }}>
          Studytracker
        </div>
        <div style={{ display: "flex", marginTop: 12, fontSize: 46, color: "#404040" }}>
          Grow knowledge. Reinforce it. Make it last.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 48 }}>
          {CHIPS.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 18,
                backgroundColor: "#171717",
                color: "#fafafa",
                fontSize: 26,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

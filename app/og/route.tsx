import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  const base = "https://trendsta.in"

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg,#020617,#0f172a)",
          color: "white",
          fontFamily: "sans-serif"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px"
          }}
        >
          <img src={`${base}/T_logo.png`} width="70" height="70" />

          <div
            style={{
              fontSize: 54,
              fontWeight: 700
            }}
          >
            Trendsta
          </div>
        </div>

        {/* CENTER TEXT */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1
            }}
          >
            AI Social Growth Intelligence
          </div>

          <div
            style={{
              fontSize: 32,
              opacity: 0.8
            }}
          >
            Discover trends • Generate viral ideas • Grow faster
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px"
          }}
        >
          <img
            src={`${base}/dashboard.png`}
            width="900"
            style={{
              borderRadius: 20,
              boxShadow: "0 40px 100px rgba(255,115,0,0.35)"
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
}
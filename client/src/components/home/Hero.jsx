import heroImage from "../../assets/p1.jpg";

export default function Hero() {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#7a0a0a",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

        @keyframes fadeSlideDown {
          0% { opacity: 0; transform: translateX(-50%) translateY(-40px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @keyframes float {
          0%   { transform: translateX(-50%) translateY(0px) rotate(-1deg); }
          25%  { transform: translateX(-50%) translateY(-6px) rotate(1deg); }
          50%  { transform: translateX(-50%) translateY(-2px) rotate(-0.5deg); }
          75%  { transform: translateX(-50%) translateY(-8px) rotate(1.5deg); }
          100% { transform: translateX(-50%) translateY(0px) rotate(-1deg); }
        }

        @keyframes letterWave {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }

        .hero-wrapper {
          position: absolute;
          top: 2%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          pointer-events: none;
          z-index: 10;
          white-space: nowrap;
          animation: fadeSlideDown 1s ease forwards, float 4s ease-in-out 1s infinite;
          opacity: 0;
        }

        .hero-text {
          font-family: 'Dancing Script', cursive;
          font-size: clamp(2rem, 5vw, 5rem);
          font-weight: 700;
          letter-spacing: 0.04em;
          display: inline-block;
        }

        .hero-text span {
          display: inline-block;
          background: linear-gradient(135deg, #fff5d6, #ffd700, #ffaa00, #fff5d6);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: letterWave 2s ease-in-out infinite, gradientShift 3s linear infinite;
          text-shadow: none;
          filter: drop-shadow(0 2px 8px rgba(255,180,0,0.5));
        }

        @keyframes gradientShift {
          0%   { background-position: 0% center; }
          100% { background-position: 300% center; }
        }

        .hero-text span:nth-child(1)  { animation-delay: 0s,    0s; }
        .hero-text span:nth-child(2)  { animation-delay: 0.08s, 0s; }
        .hero-text span:nth-child(3)  { animation-delay: 0.16s, 0s; }
        .hero-text span:nth-child(4)  { animation-delay: 0.24s, 0s; }
        .hero-text span:nth-child(5)  { animation-delay: 0.32s, 0s; }
        .hero-text span:nth-child(6)  { animation-delay: 0.40s, 0s; }
        .hero-text span:nth-child(7)  { animation-delay: 0.48s, 0s; }
        .hero-text span:nth-child(8)  { animation-delay: 0.56s, 0s; }
        .hero-text span:nth-child(9)  { animation-delay: 0.64s, 0s; }
        .hero-text span:nth-child(10) { animation-delay: 0.72s, 0s; }
        .hero-text span:nth-child(11) { animation-delay: 0.80s, 0s; }
        .hero-text span:nth-child(12) { animation-delay: 0.88s, 0s; }
        .hero-text span:nth-child(13) { animation-delay: 0.96s, 0s; }
        .hero-text span:nth-child(14) { animation-delay: 1.04s, 0s; }
        .hero-text span:nth-child(15) { animation-delay: 1.12s, 0s; }
        .hero-text span:nth-child(16) { animation-delay: 1.20s, 0s; }
        .hero-text span:nth-child(17) { animation-delay: 1.28s, 0s; }
        .hero-text span:nth-child(18) { animation-delay: 1.36s, 0s; }
        .hero-text span:nth-child(19) { animation-delay: 1.44s, 0s; }
        .hero-text span:nth-child(20) { animation-delay: 1.52s, 0s; }
      `}</style>

      <div className="hero-wrapper">
        <div className="hero-text">
          {"trao gửi yêu thương".split("").map((char, i) => (
            <span key={i}>{char === " " ? "\u00A0" : char}</span>
          ))}
        </div>
      </div>

      <img
        src={heroImage}
        alt="Hero"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          maxWidth: "1920px",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

function WeatherLandscape() {
  return (
    <svg
      aria-hidden="true"
      className="weather-landscape"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 390"
    >
      <defs>
        <linearGradient id="weather-sky" x2="1" y2="1">
          <stop offset="0" stopColor="var(--hero-sky-start)" />
          <stop offset="1" stopColor="var(--hero-sky-end)" />
        </linearGradient>
        <linearGradient id="weather-hill" x2="0.7" y2="1">
          <stop offset="0" stopColor="var(--hero-hill-front)" />
          <stop offset="1" stopColor="var(--hero-hill-back)" />
        </linearGradient>
      </defs>
      <path className="hero-sky" d="M0 0h1200v390H0z" fill="url(#weather-sky)" />
      <g className="hero-sun-rings">
        <circle cx="926" cy="151" r="126" />
        <circle cx="926" cy="151" r="95" />
      </g>
      <circle className="hero-sun" cx="926" cy="151" r="72" />
      <path
        className="hero-cloud-back"
        d="M845 214h185a20 20 0 0 0 0-40h-32a28 28 0 0 0-50-10h-25a25 25 0 0 0-44 22h-34a14 14 0 0 0 0 28"
      />
      <path
        className="hero-cloud-front"
        d="M744 244h155a15 15 0 0 0 0-30h-28a24 24 0 0 0-43-8h-24a20 20 0 0 0-33 17h-27a11 11 0 0 0 0 21"
      />
      <path className="hero-hill-back" d="M183 390c77-114 271-115 473-54l248 54Z" />
      <path className="hero-hill-front" d="M369 390c244-149 595-158 831-61v61Z" fill="url(#weather-hill)" />
      <path
        className="hero-hill-back"
        d="M739 390c159-67 327-77 461-45v45Z"
        opacity=".6"
      />
      <g className="hero-sparkles" strokeWidth="1.5">
        <path d="M687 76v12m-6-6h12m-10-4 8 8m0-8-8 8M1117 133v10m-5-5h10" />
      </g>
    </svg>
  )
}

export default WeatherLandscape

let config = {
  API_URL: "http://localhost:3000/api/books",
  AUTH_URL: "http://localhost:3000/api/auth",
  USER_ID: "demo-user",
};

export async function loadConfig() {
  try {
    const isLocal = window.location.hostname === "localhost";

    const configUrl = isLocal
      ? "/runtime-config-dev/config.json"
      : "/runtime-config/config.json";

    const res = await fetch(configUrl, { cache: "no-cache" });

    const data = await res.json();

    config.API_URL = `${data.API_URL}/api/books`;
    config.AUTH_URL = `${data.API_URL}/api/auth`;
  } catch (err) {
    console.error("Failed to load config.json, using default config.", err);
  }
}

export { config };

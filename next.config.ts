import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/hukuk-rehberi/soru/kira-sozlesmesi-bitmeden-evden-cikmak",
        destination: "/hukuk-rehberi/soru/kira-sozlesmem-bitmeden-evden-cikarsam",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

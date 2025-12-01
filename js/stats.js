(function () {
  const timeNow = new Date().toISOString();

  const ua = navigator.userAgent;
  const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? "Mobile" : "PC";

  fetch("https://ipwho.is/")
    .then((res) => res.json())
    .then((data) => {
      const ip = data.ip || "Không có";
      const city = data.city || "Không có";
      const region = data.region || "Không có";
      const country = data.country || "Không có";

      fetch("https://noble-debee-tandev-06be2084.koyeb.app/stats/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastTime: timeNow,
          ip: ip,
          area: `${city}, ${region}, ${country}`,
          device: device,
        }),
      })
        .then((res) => res.json())
        .then((result) => console.log("Stats sent:", result))
        .catch((err) => console.error("Stats API error:", err));
    })
    .catch(() => {
      console.warn("Không lấy được IP/khu vực, vẫn gửi device + time");
      const visitData = {
        lastTime: timeNow,
        ip: "Không có",
        area: "Không có",
        device: device,
      };
      fetch("https://noble-debee-tandev-06be2084.koyeb.app/stats/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
      });
    });
})();

require("env-yaml").config();

const cors = require("cors")();
const EdgeGrid = require("akamai-edgegrid");
const eg = new EdgeGrid(
  process.env.AKAMAI_CLIENT_TOKEN,
  process.env.AKAMAI_CLIENT_SECRET,
  process.env.AKAMAI_ACCESS_TOKEN,
  process.env.AKAMAI_HOST,
  process.env.AKAMAI_DEBUG
);

exports.purgeAkamai = async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).json({ error: "Error: expected HTTP POST" });
    }

    if (!req.get("X-Auth")) {
      return res
        .status(400)
        .json({ error: `Error: Requires "X-Auth" header with Service Key` });
    }
    if (req.get("X-Auth") !== process.env.SERVICE_KEY) {
      return res.status(401).json({ error: "Error: Unauthorized" });
    }

    const cacheTags = JSON.parse(req.body);
    const zuid = cacheTags.objects[0];

    if (zuid.includes("8-")) {
      // purge the instances system cache, requires the Instance ZUID, check to see if zuid starts with 8- to represent an instance zuid https://zesty-io.github.io/zuid-specification/
      // this is done because its possible to purge other tags (not instance zuids) in Akamai
      await fetch(
        `https://us-central1-zesty-prod.cloudfunctions.net/redisPurge?zuid=${zuid}`
      );
    }

    eg.auth({
      path: `/ccu/v3/invalidate/tag/${process.env.AKAMAI_ENV}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: cacheTags,
    });

    eg.send((err, response, body) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.json({
          message:
            "Purge request sent successfully. Cache can refresh as soon as 5 seconds or as long as 8 minutes per Akamai SLA.",
          cacheTagsPurged: cacheTags.objects,
          akamaiResponse: JSON.parse(body),
        });
      }
    });
  });
};

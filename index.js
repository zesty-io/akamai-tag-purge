require("env-yaml").config();

const cors = require("cors")();
const EdgeGrid = require("akamai-edgegrid");

exports.akamaiFastPurge = (req, res) => {
  // NOTE: We have wrapped this logic in a Promise to support
  // the test harness awaiting during the async operation of
  // the Akamai cache purge.
  return new Promise((resolve, reject) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        res.status(400).json({ error: "Error: expected HTTP POST" });
        resolve();
        return;
      }
      if (!req.get("X-Auth")) {
        res
          .status(400)
          .json({ error: `Error: Requires "X-Auth" header with Service Key` });
        resolve();
        return;
      }
      if (req.get("X-Auth") !== process.env.SERVICE_KEY) {
        res.status(401).json({ error: "Error: Unauthorized" });
        resolve();
        return;
      }

      const tags = JSON.parse(req.body);
      const zuid = tags.objects[0];

      if (zuid.includes("8-")) {
        // purge the instances system cache, requires the Instance ZUID, check to see if zuid starts with 8- to represent an instance zuid https://zesty-io.github.io/zuid-specification/
        // this is done because its possible to purge other tags (not instance zuids) in Akamai
        await fetch(
          `https://us-central1-zesty-prod.cloudfunctions.net/redisPurge?zuid=${zuid}`
        );
      }

      const eg = new EdgeGrid(
        process.env.AKAMAI_CLIENT_TOKEN,
        process.env.AKAMAI_CLIENT_SECRET,
        process.env.AKAMAI_ACCESS_TOKEN,
        process.env.AKAMAI_HOST,
        process.env.AKAMAI_DEBUG === "true" ? true : false // yaml does not maintain type
      );

      eg.auth({
        path: `/ccu/v3/invalidate/tag/${process.env.AKAMAI_ENV}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: tags,
      });

      eg.send((err, response, body) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          const response = {
            message:
              "Purge request sent successfully. Cache can refresh as soon as 5 seconds or as long as 8 minutes per Akamai SLA.",
            cacheTagsPurged: tags.objects,
            akamaiResponse: JSON.parse(body),
          };
          res.status(200).json(response);
        }

        resolve();
        return;
      });
    });
  });
};

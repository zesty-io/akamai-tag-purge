require("env-yaml").config();

// var EdgeGrid = require("edgegrid");

// var eg = new EdgeGrid(
//   process.env.AKAMAI_CLIENT_TOKEN,
//   process.env.AKAMAI_CLIENT_SECRET,
//   process.env.AKAMAI_ACCESS_TOKEN,
//   process.env.AKAMAI_HOST
// );

// /// caches tag
// var cacheTags = {
//   objects: ["Foo", "Bar"],
// };

// var headers = {
//   "Content-Type": "application/json",
// };

// eg.auth({
//   path: `/ccu/v3/invalidate/tag/${process.env.AKAMAI_ENV}`,
//   method: "POST",
//   headers: headers,
//   body: cacheTags,
// });

// eg.send(function (error, response, body) {
//   if (error != null) {
//     console.log("Error", error);
//   } else {
//     console.log("Success", body);
//   }
// });

const test = require("tape");
const sinon = require("sinon");
const { createRequest, createResponse } = require("node-mocks-http");

const { purgeAkamai } = require("./index.js");

test("purgeAkamai: 400 Error: expected HTTP POST", async (t) => {
  const req = createRequest({
    method: "GET",
    url: "/",
    params: {},
    body: {},
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = createResponse();

  sinon.spy(res, "status");
  sinon.spy(res, "json");

  await purgeAkamai(req, res);

  t.doesNotThrow(() => sinon.assert.calledOnceWithExactly(res.status, 400));
  t.doesNotThrow(() =>
    sinon.assert.calledOnceWithExactly(res.json, "Error: expected HTTP POST")
  );

  t.end();
});

test(`purgeAkamai: 400 Error: Requires "X-Auth" header with Service Key`, async (t) => {
  const req = createRequest({
    method: "POST",
    url: "/",
    params: {},
    body: {},
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = createResponse();

  sinon.spy(res, "status");
  sinon.spy(res, "json");

  await purgeAkamai(req, res);

  t.doesNotThrow(() => sinon.assert.calledOnceWithExactly(res.status, 400));
  t.doesNotThrow(() =>
    sinon.assert.calledOnceWithExactly(
      res.json,
      `Error: Requires "X-Auth" header with Service Key`
    )
  );

  t.end();
});

test(`purgeAkamai: 401 Error: Unauthorized`, async (t) => {
  const req = createRequest({
    method: "POST",
    url: "/",
    params: {},
    body: {},
    headers: {
      "Content-Type": "application/json",
      "X-Auth": "FAIL",
    },
  });
  const res = createResponse();

  sinon.spy(res, "status");
  sinon.spy(res, "json");

  await purgeAkamai(req, res);

  t.doesNotThrow(() => sinon.assert.calledOnceWithExactly(res.status, 401));
  t.doesNotThrow(() =>
    sinon.assert.calledOnceWithExactly(res.json, `Error: Unauthorized`)
  );

  t.end();
});

test(`purgeAkamai: 401 Error: Unauthorized`, async (t) => {
  const req = createRequest({
    method: "POST",
    url: "/",
    params: {},
    body: {
      objects: ["Foo", "Bar"],
    },
    headers: {
      "Content-Type": "application/json",
      "X-Auth": process.env.SERVICE_KEY,
    },
  });
  const res = createResponse();

  sinon.spy(res, "status");
  sinon.spy(res, "json");

  await purgeAkamai(req, res);

  t.doesNotThrow(() => sinon.assert.calledOnceWithExactly(res.status, 401));
  t.doesNotThrow(() =>
    sinon.assert.calledOnceWithExactly(res.json, `Error: Unauthorized`)
  );

  t.end();
});

const desktop = process.env.AUDIT_DEVICE === "desktop";
module.exports = {ci:{
  collect:{
    staticDistDir:".",
    url:["http://localhost/","http://localhost/experience.html","http://localhost/press.html","http://localhost/perspectives.html","http://localhost/cadet-leadership.html"],
    numberOfRuns:3,
    settings:{chromeFlags:"--no-sandbox",...(desktop?{preset:"desktop"}:{})}
  },
  assert:{assertions:{
    "categories:performance":["warn",{minScore:0.9}],
    "categories:accessibility":["warn",{minScore:0.95}],
    "categories:seo":["warn",{minScore:0.95}],
    "largest-contentful-paint":["warn",{maxNumericValue:2500}],
    "cumulative-layout-shift":["warn",{maxNumericValue:0.1}],
    "total-blocking-time":["warn",{maxNumericValue:200}]
  }},
  upload:{target:"filesystem",outputDir:"lighthouse-reports"}
}};

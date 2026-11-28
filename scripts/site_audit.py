#!/usr/bin/env python3
"""Generate canonical sitemap and RSS from published HTML, and audit local links."""
import argparse
import json
import re
from datetime import datetime
from email.utils import format_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urljoin, unquote
from xml.sax.saxutils import escape
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from urllib.request import Request, urlopen
from urllib.error import HTTPError
ROOT = Path(__file__).resolve().parents[1]
BASE = "https://dultenrichard.github.io/dultenrichard/"
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.canonical = None
        self.links = []
        self.images = []
        self.ids = []
        self.schemas = []
        self.h1 = 0
        self.in_json = False
        self.buffer = ""
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"): self.ids.append(a["id"])
        if tag == "h1": self.h1 += 1
        if tag == "link" and a.get("rel") == "canonical": self.canonical = a.get("href")
        if tag == "a" and a.get("href"): self.links.append(a["href"])
        if tag == "img" and a.get("src"): self.images.append(a["src"])
        if tag == "script" and a.get("type") == "application/ld+json":
            self.in_json = True
            self.buffer = ""
    def handle_data(self, text):
        if self.in_json: self.buffer += text
    def handle_endtag(self, tag):
        if tag == "script" and self.in_json:
            self.schemas.append(json.loads(self.buffer))
            self.in_json = False

def read_pages():
    return {p.name: Page(p.read_text(encoding="utf-8")) for p in ROOT.glob("*.html")}
def url(name):
    return BASE + ("" if name == "index.html" else name)
def generate(pages):
    canonical = [(n,p) for n,p in pages.items() if p.canonical == url(n) and n != "404.html"]
    canonical.sort(key=lambda x: (x[0] != "index.html", x[0]))
    s = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
    articles = []
    for n,p in canonical:
        s.append("  <url><loc>"+escape(url(n))+"</loc>")
        for im in sorted(set(p.images)):
            s.append("    <image:image><image:loc>"+escape(urljoin(url(n),im))+"</image:loc></image:image>")
        s.append("  </url>")
        for j in p.schemas:
            if j.get("@type") == "Article": articles.append((j,n))
    s.append("</urlset>")
    rss = ['<?xml version="1.0" encoding="UTF-8"?>','<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>','<title>Dulten Richard — Perspectives</title>','<link>'+BASE+'perspectives.html</link>','<description>Essays on leadership, civic participation and youth opportunity.</description>','<language>en-ca</language>','<atom:link href="'+BASE+'feed.xml" rel="self" type="application/rss+xml"/>']
    for j,n in sorted(articles,key=lambda a:(a[0]["datePublished"],a[1]),reverse=True):
        dt = format_datetime(datetime.fromisoformat(j["datePublished"]+"T00:00:00+00:00"),usegmt=True)
        u = escape(url(n))
        rss.append("<item><title>"+escape(j["headline"])+"</title><link>"+u+"</link><guid>"+u+"</guid><description>"+escape(j["description"])+"</description><pubDate>"+dt+"</pubDate></item>")
    rss.append("</channel></rss>")
    return {"sitemap.xml":"\n".join(s)+"\n","feed.xml":"\n".join(rss)+"\n"}
def validate(pages):
    errors=[]
    for name,p in pages.items():
        if p.h1 != 1: errors.append(f"{name}: expected one H1")
        for id_, count in Counter(p.ids).items():
            if count > 1: errors.append(f"{name}: duplicate id {id_}")
        for link in p.links+p.images:
            if link.startswith(("mailto:","tel:","data:")): continue
            target=urljoin(url(name),link)
            if not target.startswith(BASE): continue
            x=urlsplit(target)
            rel=unquote(x.path[len(urlsplit(BASE).path):]) or "index.html"
            if rel.endswith("/"): rel+="index.html"
            if not (ROOT/rel).is_file():
                errors.append(f"{name}: missing {link}")
            elif x.fragment and rel in pages and x.fragment not in pages[rel].ids:
                errors.append(f"{name}: missing anchor {link}")
    return errors
def probe(u):
    try:
        req=Request(u,headers={"User-Agent":"PersonalSiteLinkAudit/1.0"},method="HEAD")
        try:
            with urlopen(req,timeout=12) as r: return (u,str(r.status),r.geturl())
        except HTTPError as e:
            if e.code not in (403,405,501): raise
        with urlopen(Request(u,headers={"User-Agent":"PersonalSiteLinkAudit/1.0"}),timeout=12) as r:
            return (u,str(r.status),r.geturl())
    except HTTPError as e: return (u,str(e.code),"manual review")
    except Exception as e: return (u,"unverified",str(e))
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--check",action="store_true")
    ap.add_argument("--external",action="store_true")
    args=ap.parse_args()
    pages=read_pages()
    errors=validate(pages)
    for name,data in generate(pages).items():
        f=ROOT/name
        if args.check:
            if not f.exists() or f.read_text(encoding="utf-8")!=data: errors.append(f"{name}: regenerate with python scripts/site_audit.py")
        else: f.write_text(data,encoding="utf-8")
    if args.external:
        links=sorted({u for p in pages.values() for u in p.links if u.startswith("https://") and not u.startswith(BASE)})
        with ThreadPoolExecutor(max_workers=6) as pool:
            for u,status,detail in pool.map(probe,links): print(f"{status}\t{u}\t{detail}")
    for e in errors: print(e)
    print(f"Checked {len(pages)} HTML files; {len(errors)} internal errors.")
    raise SystemExit(bool(errors))
if __name__=="__main__": main()

#!/usr/bin/env python3
"""
Pubblica il Worker di cdn.getgradient.it (strumenti/cdn/worker.js) e lo collega al sottodominio.

  python3 strumenti/cdn/pubblica.py

Token: ~/.config/cloudflare/cloudflare.token (DNS e Workers sulla zona getgradient.it).
Le chiamate passano da curl: il Python di sistema non ha i certificati.
"""
import json
import subprocess
from pathlib import Path

API = "https://api.cloudflare.com/client/v4"
ZONA = "getgradient.it"
HOST = "cdn.getgradient.it"
WORKER = "gradient-cdn"
CODICE = Path(__file__).with_name("worker.js")


def curl(metodo, url, token, dati=None, campi=()):
    cmd = ["curl", "-s", "--max-time", "60", "-X", metodo, url, "-H", f"Authorization: Bearer {token}"]
    if dati is not None:
        cmd += ["-H", "Content-Type: application/json", "--data", json.dumps(dati)]
    for c in campi:
        cmd += ["-F", c]
    r = json.loads(subprocess.run(cmd, capture_output=True, text=True, check=True).stdout)
    if not r.get("success"):
        raise SystemExit(f"{metodo} {url}: {r.get('errors')}")
    return r["result"]


def main():
    token = (Path.home() / ".config/cloudflare/cloudflare.token").read_text().strip()
    zona = curl("GET", f"{API}/zones?name={ZONA}", token)[0]
    conto = zona["account"]["id"]
    meta = {"main_module": "worker.js", "compatibility_date": "2026-10-01"}
    curl("PUT", f"{API}/accounts/{conto}/workers/scripts/{WORKER}", token,
         campi=[f"metadata={json.dumps(meta)};type=application/json",
                f"worker.js=@{CODICE};type=application/javascript+module"])
    print(f"Worker {WORKER} pubblicato")
    d = curl("PUT", f"{API}/accounts/{conto}/workers/domains", token,
             {"hostname": HOST, "service": WORKER, "zone_id": zona["id"], "environment": "production"})
    print(f"Dominio {d['hostname']} → {d['service']}")


if __name__ == "__main__":
    main()

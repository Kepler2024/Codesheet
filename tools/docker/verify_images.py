#!/usr/bin/env python3
"""Verify public OCI indexes directly, without Docker's credential helper."""
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import sys
from urllib.request import Request, urlopen

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from tools.execution import IMAGES


def fetch(url, headers=None):
    with urlopen(Request(url, headers=headers or {}), timeout=30) as response:
        return json.load(response)


def inspect(tag):
    if tag.startswith('mcr.microsoft.com/'):
        registry = 'mcr.microsoft.com'
        repository, version = tag.split('/', 1)[1].rsplit(':', 1)
        headers = {}
    else:
        registry = 'registry-1.docker.io'
        repository, version = tag.rsplit(':', 1)
        if '/' not in repository:
            repository = 'library/' + repository
        token = fetch('https://auth.docker.io/token?service=registry.docker.io&scope=repository:' + repository + ':pull')['token']
        headers = {'Authorization': 'Bearer ' + token}
    headers['Accept'] = ', '.join(['application/vnd.oci.image.index.v1+json', 'application/vnd.docker.distribution.manifest.list.v2+json'])
    manifest = fetch(f'https://{registry}/v2/{repository}/manifests/{version}', headers)
    platforms = sorted({f"{m['platform'].get('os')}/{m['platform'].get('architecture')}" for m in manifest.get('manifests', [])})
    if not {'linux/arm64', 'linux/amd64'}.issubset(platforms):
        raise ValueError(f'{tag}: missing required platforms: {platforms}')
    return f'{tag}: linux/amd64, linux/arm64 verified'


def main():
    images = list(dict.fromkeys(v for v in IMAGES.values() if not v.startswith('codesheet-')))
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [(tag, executor.submit(inspect, tag)) for tag in images]
        failed = False
        for tag, future in futures:
            try:
                print(future.result(), flush=True)
            except Exception as error:
                failed = True
                print(f'{tag}: {error}', flush=True)
    return int(failed)


if __name__ == '__main__':
    raise SystemExit(main())

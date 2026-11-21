"""One small adapter per language."""
from importlib import import_module


def adapter(lang):
    return import_module('tools.langs.' + lang)

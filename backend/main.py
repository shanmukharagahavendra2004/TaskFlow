"""
main.py  (project root)
───────────────────────
Uvicorn entry-point.

    python -m uvicorn main:app --reload
"""

from app.main import create_app

app = create_app()

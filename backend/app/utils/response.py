"""
app/utils/response.py
─────────────────────
Thin helpers that return a uniform JSON envelope:
{ "success": bool, "message": str, "data": ... }
"""

from fastapi.responses import JSONResponse
from typing import Any, Optional, List, Dict


def success_response(
    message: str = "Success",
    data: Any = None,
    status_code: int = 200,
) -> JSONResponse:
    body: Dict[str, Any] = {"success": True, "message": message}
    if data is not None:
        body["data"] = data
    return JSONResponse(content=body, status_code=status_code)


def error_response(
    message: str = "An error occurred",
    status_code: int = 400,
    errors: Optional[List[Dict]] = None,
) -> JSONResponse:
    body: Dict[str, Any] = {"success": False, "message": message}
    if errors:
        body["errors"] = errors
    return JSONResponse(content=body, status_code=status_code)

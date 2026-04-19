from pathlib import Path
import mimetypes


ROOT = Path(__file__).resolve().parent


def resolve_path(path_info: str) -> Path:
    clean = (path_info or "/").split("?", 1)[0].split("#", 1)[0]

    if clean in ("", "/"):
        return ROOT / "index.html"
    if clean == "/login":
        return ROOT / "login.html"
    if clean == "/compose":
        return ROOT / "compose.html"
    if clean == "/post":
        return ROOT / "post.html"

    relative = clean.lstrip("/")
    target = ROOT / relative

    if target.is_dir():
        return target / "index.html"
    return target


def app(environ, start_response):
    path = resolve_path(environ.get("PATH_INFO", "/"))

    if not path.exists() or not path.is_file():
        body = b"Not Found"
        start_response(
            "404 Not Found",
            [
                ("Content-Type", "text/plain; charset=utf-8"),
                ("Content-Length", str(len(body))),
            ],
        )
        return [body]

    content_type, _ = mimetypes.guess_type(str(path))
    if not content_type:
        content_type = "application/octet-stream"

    data = path.read_bytes()
    start_response(
        "200 OK",
        [
            ("Content-Type", content_type),
            ("Content-Length", str(len(data))),
            ("Cache-Control", "no-cache"),
        ],
    )
    return [data]

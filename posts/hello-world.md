---
title: "Hello World — Welcome to My Blog"
date: 2026-04-02
tags: [meta, personal]
excerpt: "First post! Why I decided to start writing, and what you can expect from this blog."
---

## Why a blog?

I've been building software for a while now, and I realized something: **I learn best when I explain things to others.** This blog is my space to do exactly that.

Expect posts about:
- AI and computer vision projects
- Full-stack development patterns
- Things I break and how I fix them
- Interesting problems I encounter

## What's coming next

I'm currently deep into building **Spixer**, an AI-powered platform for race photography. There's a lot to share — from YOLO object detection to person re-identification. Stay tuned.

## A quick code sample

Here's a taste of what I mean — a simple async pipeline pattern in Python:

```python
async def process_image(image_path: str) -> dict:
    """Run the full detection pipeline on a single image."""
    detections = await detect_persons(image_path)
    
    results = []
    for det in detections:
        crop = extract_crop(image_path, det.bbox)
        bib = await read_bib(crop)
        face = await extract_face(crop)
        results.append({
            "bbox": det.bbox,
            "bib": bib,
            "face_embedding": face,
        })
    
    return {"image": image_path, "detections": results}
```

Simple, readable, async. That's the vibe.

---

*Thanks for reading. More soon.*

---
title: "Building with YOLOv8 — From Detection to Production"
date: 2026-03-28
tags: [AI, YOLOv8, Python, computer-vision]
excerpt: "How I integrated YOLOv8 into a production pipeline for real-time person detection at race events."
---

## The Problem

Race photography generates **thousands** of images per event. Photographers shoot continuous bursts as runners pass by. The challenge: automatically identify *who* is in each photo.

Step one? **Detect every person in every image.**

## Why YOLO?

YOLO (You Only Look Once) is the gold standard for real-time object detection. Version 8 by Ultralytics made it even easier to integrate:

```python
from ultralytics import YOLO

model = YOLO("yolov8x.pt")

results = model.predict(
    source="race_photo.jpg",
    classes=[0],  # person class only
    conf=0.5,
    verbose=False,
)
```

That's it. Four lines to detect every person in a photo with high accuracy.

## The Pipeline

Detection is just the beginning. After YOLO finds each person, the pipeline:

1. **Crops** the person bounding box
2. **Reads the bib number** via OCR on the upper body
3. **Extracts face embeddings** for recognition
4. **Computes ReID features** for cross-image matching

```
Image → YOLO Detection → Crop → [OCR, Face, ReID] → Fusion → Result
```

## Lessons Learned

- **Confidence thresholds matter.** Too low = false positives. Too high = missed runners.
- **Batch processing** is critical at scale. Process images in GPU batches, not one by one.
- **Model warm-up** — always run a dummy inference before timing benchmarks.

> "The best code is the code you don't have to debug at 2 AM during an event."

More on the OCR and face recognition stages in the next post.

---

*Part of a series on building Spixer.*

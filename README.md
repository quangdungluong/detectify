# Detectify

Detectify is a full-stack application for detecting people in images using YOLO object detection. This application provides an intuitive web interface to upload images and view detection results.

## Features

- Image Upload
- People Detection

## Installation

```bash
docker-compose up -d
```

## Future Improvements

### 1. Model Optimization

- [ ] Convert to ONNX
- [ ] Use TensorRT for GPU server
- [ ] Quantize model

### 2. Inference Server Integration

- [ ] Set up Triton Inference Server
- [ ] Implement Triton client in FastAPI

### 3. Caching Strategy

- [ ] Redis implementation
  - [ ] Set up Redis container
  - [ ] Configure cache TTL
  - [ ] Implement cache middleware
- [ ] Image hash-based caching
  - [ ] Generate perceptual hashes
  - [ ] Store results by hash
  - [ ] Handle near-duplicates

### 4. Distributed Processing

- [ ] Horizontal scaling

### 5. Setup monitoring system

- [ ] Setup monitoring system using Prometheus + Grafana

### 6. Setup center logging system

- [ ] Setup center logging system using ELK

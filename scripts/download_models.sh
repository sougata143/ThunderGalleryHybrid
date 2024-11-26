#!/bin/bash

# Create model directories
mkdir -p app/assets/models/object_detection
mkdir -p app/assets/models/style_transfer

# Download object detection model (MobileNet SSD)
curl -L "https://storage.googleapis.com/tfjs-models/savedmodel/ssd_mobilenet_v1/model.json" \
     -o "app/assets/models/object_detection/model.json"
curl -L "https://storage.googleapis.com/tfjs-models/savedmodel/ssd_mobilenet_v1/group1-shard1of1.bin" \
     -o "app/assets/models/object_detection/weights.bin"

# Download style transfer model (arbitrary-image-stylization-v1-256)
curl -L "https://storage.googleapis.com/magentadata/js/checkpoints/style/arbitrary/model.json" \
     -o "app/assets/models/style_transfer/model.json"
curl -L "https://storage.googleapis.com/magentadata/js/checkpoints/style/arbitrary/group1-shard1of1.bin" \
     -o "app/assets/models/style_transfer/weights.bin"

echo "Models downloaded successfully!"
